from datetime import date
from enum import Enum
import logging
from typing import Final

from app.forms.user import WeekdayEnum
import sqlmodel
from app.db import get_db_session
from app.models import (
    AvailableWeekdays,
    Matches,
    Offers,
    OperatorProducts,
    Users,
    Weekdays,
)
import geopy.distance  # type: ignore
from sqlmodel import select, func

from app.notifications import push_notifications


class MatchingStatus(Enum):
    PENDING = "pending"
    INTERESTED = "interested"
    NOT_INTERESTED = "not_interested"
    MATCHED = "matched"
    FINALIZED = "finalized"


MAX_MATCHES_PER_OFFER: Final[int] = 15


def distance_penalty(offer: Offers, user: Users) -> float:
    if offer.location is None:
        return 0
    if user.location is None:
        return 0

    return float(
        geopy.distance.distance(
            (offer.location.geo_latitude, offer.location.geo_latitude),
            (user.location.geo_latitude, user.location.geo_longitude),
        ).km  # type: ignore
    ) / float(user.location.radius or 1)


def operator_rating_penalty(user: Users, session: sqlmodel.Session) -> float:
    return -float(
        session.exec(
            select(func.avg(Offers.operator_rating))
            .join(Matches)
            .where(Matches.operator_id == user.user_id)
        ).one()
        or 0
    )


def client_rating_penalty(user: Users, session: sqlmodel.Session) -> float:
    return -float(
        session.exec(
            select(func.avg(Offers.client_rating)).where(
                Offers.client_id == user.user_id
            )
        ).one()
        or 0
    )


def get_weekdays() -> list[Weekdays]:
    with get_db_session() as session:
        return list(session.exec(select(Weekdays)).all())


def get_weekday_from_date(date: date) -> Weekdays:
    weekdays = get_weekdays()

    def find_weekday(which: str) -> Weekdays:
        for day in weekdays:
            if day.weekday == which:
                return day
        raise ValueError

    # INSERT INTO public."Weekdays" (weekday) VALUES
    # ('Poniedziałek'),
    # ('Wtorek'),
    # ('Środa'),
    # ('Czwartek'),
    # ('Piątek'),
    # ('Sobota'),
    # ('Niedziela');

    match date.weekday():
        case 0:
            return find_weekday(WeekdayEnum.Poniedziałek)
        case 1:
            return find_weekday(WeekdayEnum.Wtorek)
        case 2:
            return find_weekday(WeekdayEnum.Środa)
        case 3:
            return find_weekday(WeekdayEnum.Czwartek)
        case 4:
            return find_weekday(WeekdayEnum.Piątek)
        case 5:
            return find_weekday(WeekdayEnum.Sobota)
        case 6:
            return find_weekday(WeekdayEnum.Niedziela)
        case _:
            raise ValueError


def all_capable_of_completing(offer: Offers, session: sqlmodel.Session) -> list[Users]:
    stmt = (
        select(Users)
        .join(OperatorProducts)
        .where(OperatorProducts.offer_type_name == offer.offer_type)
        .where(offer.client_id != Users.user_id)
    )

    if offer.flight_date is not None:
        stmt = stmt.join(AvailableWeekdays).where(
            AvailableWeekdays.weekday
            == get_weekday_from_date(offer.flight_date).weekday
        )

    return list(session.exec(stmt).all())


def update_matches(offer: Offers, session: sqlmodel.Session):
    candidates = all_capable_of_completing(offer, session)
    candidates.sort(
        key=lambda user: distance_penalty(offer, user)
        + operator_rating_penalty(user, session)
        + client_rating_penalty(user, session)
    )
    new_candidates_count = MAX_MATCHES_PER_OFFER - len(offer.Matches)

    for candidate in candidates:
        if (
            session.exec(
                select(func.count())
                .select_from(Matches)
                .where(Matches.operator_id == candidate.user_id)
                .where(Matches.offer_id == offer.offer_id)
            ).one()
            == 0
        ):
            session.add(
                Matches(
                    operator_id=candidate.user_id,  # pyright: ignore[reportArgumentType]
                    offer_id=offer.offer_id,  # pyright: ignore[reportArgumentType]
                    status=MatchingStatus.PENDING.value,  # pyright: ignore[reportArgumentType]
                )
            )
            new_candidates_count -= 1
        if new_candidates_count == 0:
            break

    session.commit()


def update_all_matches() -> None:
    with get_db_session() as session:
        logging.warning("Updating matches")

        for offer in session.exec(
            select(Offers).where(
                ~select(Matches)
                .where(Matches.offer_id == Offers.offer_id)
                .where(
                    (Matches.status == MatchingStatus.MATCHED.value)
                    | (Matches.status == MatchingStatus.FINALIZED.value)
                )
                .exists()
            )
        ).all():
            update_matches(offer, session)
        for user in session.exec(select(Users)).all():
            push_notifications(user)
