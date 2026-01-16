import logging
from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,  # pyright: ignore[reportUnknownVariableType]
)
from pydantic import ValidationError
from sqlmodel import Session, select

from app.db import get_db_session
from app.forms.user import LocationForm, Review, UserdataForm, WeekdaysForm, WeekdayEnum
from app.models import (
    Groups,
    Locations,
    Matches,
    OfferTypes,
    OperatorProducts,
    Users as User,
    Offers as Offer,
    AvailableWeekdays
)


bp: Blueprint = Blueprint("user", __name__, url_prefix="/user")


def find_user_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == False)  # noqa: E712
        .where(Groups.client == True)  # noqa: E712
        .where(Groups.operator == False)  # noqa: E712
    ).first()


def find_admin_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == True)  # noqa: E712
        .where(Groups.client == False)  # noqa: E712
        .where(Groups.operator == False)  # noqa: E712
    ).first()


def find_operator_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == False)  # noqa: E712
        .where(Groups.client == False)  # noqa: E712
        .where(Groups.operator == True)  # noqa: E712
    ).first()


@bp.get("/data")
@bp.get("/data/<int:user_id>")
@jwt_required()
def get_userdata(user_id: int | None = None):
    user_id = user_id or int(get_jwt_identity())
    with get_db_session() as session:
        user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
        if user is None:
            logging.info(
                "Request to data of nonexistent user.",
                stack_info=True,
                extra={"user_id": user_id},
            )
            return jsonify({"reason": "non existent"}), HTTPStatus.NOT_FOUND

        reviews = list(
            map(
                lambda t: Review.model_validate(
                    {
                        "offer_id": t[0].offer_id,
                        "reviewer": t[0].client.username,  # type: ignore
                        "rating": t[2],
                        "review_date": t[0].deadline_date.strftime(
                            "%a, %d %b %G %T %Z"
                        ),
                        "review": t[1],
                    }
                ),
                session.exec(
                    select(
                        Offer,
                        Offer.client_review,
                        Offer.client_rating,
                    )
                    .select_from(User)
                    .join(Matches)
                    .join(Offer)
                    .where(Matches.operator_id == user_id)
                    .where(
                        (Offer.client_rating != None) | (Offer.client_review != None)  # noqa: E711
                    )
                    .distinct(Offer.offer_id)  # type: ignore
                ).all(),
            )
        ) + list(
            map(
                lambda t: Review.model_validate(
                    {
                        "offer_id": t[3].offer_id,
                        "reviewer": t[0].username,  # type: ignore
                        "rating": t[2],
                        "review": t[1],
                        "review_date": t[3].deadline_date.strftime(
                            "%a, %d %b %G %T %Z"
                        ),
                    }
                ),
                session.exec(
                    select(User, Offer.operator_review, Offer.operator_rating, Offer)
                    .select_from(User)
                    .join(Matches)
                    .join(Offer)
                    .where(Offer.client_id == user_id)
                    .where(
                        (Offer.operator_rating != None)  # noqa: E711
                        | (Offer.operator_review != None)  # noqa: E711
                    )
                    .distinct(Offer.offer_id)  # type: ignore
                ).all(),
            )
        )

        location: LocationForm | None = None
        role: list[str] = []

        if user.group.admin:  # pyright: ignore[reportOptionalMemberAccess]
            role.append("admin")
        if user.group.client:  # pyright: ignore[reportOptionalMemberAccess]
            role.append("client")
        if user.group.operator:  # pyright: ignore[reportOptionalMemberAccess]
            role.append("operator")
            location = LocationForm.model_validate(user.location.model_dump())  # type: ignore

        products = [
            operator_product
            for operator_product in session.exec(
                select(OperatorProducts.offer_type_name).where(
                    OperatorProducts.operator_id == user_id
                )
            ).all()
        ]

        return jsonify(
            UserdataForm.model_validate(
                {
                    "username": user.username,
                    "description": user.description,
                    "reviews": reviews,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": "+".join(role),
                    "location": location,
                    "products": products,
                    "user_id": user.user_id,
                }
            ).model_dump()
        ), HTTPStatus.OK


@bp.post("/data")
@jwt_required()
def post_userdata():
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        try:
            data = UserdataForm.model_validate(request.json)
        except ValidationError as e:
            return e.json(), HTTPStatus.BAD_REQUEST

        user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
        if user is None:
            logging.warning(
                "Request to data of nonexistent user.",
                stack_info=True,
                extra={"user_id": user_id},
            )
            return jsonify({"reason": "user not found"}), HTTPStatus.NOT_FOUND

        if data.username:
            user.username = data.username
        if data.description:
            user.description = data.description
        if data.location:
            user.location = Locations.model_validate(data.location)
        if data.phone_number:
            user.phone_number = data.phone_number
        for product in data.products:
            for operator_product in session.exec(
                select(OfferTypes.name).where(OfferTypes.name == product)
            ).all():
                if (
                    session.exec(
                        select(OperatorProducts)
                        .where(OperatorProducts.operator_id == user_id)
                        .where(OperatorProducts.offer_type_name == operator_product)
                    ).first()
                    is None
                ):
                    session.add(
                        OperatorProducts(
                            operator_id=user_id, offer_type_name=operator_product
                        )
                    )

        if data.role:
            match data.role:  # type: ignore
                case "client":
                    user.group = find_user_group(session)
                    user.group_id = user.group.group_id  # type: ignore
                case "admin":
                    user.group = find_admin_group(session)
                    user.group_id = user.group.group_id  # type: ignore
                case "operator":
                    user.group = find_operator_group(session)
                    user.group_id = user.group.group_id  # type: ignore

        session.commit()

        return jsonify({"msg": "ok"}), HTTPStatus.OK


@bp.post("/weekdays")
@jwt_required()
def post_avaiable_weekdays():
    operator_id = int(get_jwt_identity())
    with get_db_session() as session:
        try:
            data = WeekdaysForm.model_validate(request.json)
        except ValidationError as e:
            return e.json(), HTTPStatus.BAD_REQUEST

        user = session.exec(select(User).where(User.user_id == operator_id)).one_or_none()
        if user is None:
            logging.info(
                "Request to data of nonexistent user.",
                stack_info=True,
                extra={"user_id": operator_id},
            )
            return jsonify({"reason": "non existent"}), HTTPStatus.NOT_FOUND
        if not user.group.operator:
            logging.info(
                "User is not operator",
                stack_info=True,
                extra={"user_id": operator_id},
            )
            return jsonify({"reason": "User is not operator"}), HTTPStatus.FORBIDDEN

        current_days = set(
            session.exec(
                select(AvailableWeekdays.weekday).where(
                    AvailableWeekdays.operator_id == operator_id
                )
            ).all()
        )

        days_to_add = {day for day, available in data.weekdays.items() if available}
        days_to_remove = {day for day, available in data.weekdays.items() if not available}

        to_add = days_to_add - current_days
        to_remove = days_to_remove & current_days

        rows_to_remove = session.exec(
            select(AvailableWeekdays).where(
                AvailableWeekdays.operator_id == operator_id,
                AvailableWeekdays.weekday.in_(to_remove)  # type: ignore
            )
        ).all()

        for row in rows_to_remove:
            session.delete(row)

        session.add_all(
            AvailableWeekdays(
                operator_id=operator_id,
                weekday=day
            )
            for day in to_add
        )

        session.commit()
        return jsonify({"msg": "ok"}), HTTPStatus.OK


@bp.get("/weekdays")
@bp.get("/weekdays/<int:user_id>")
@jwt_required()
def get_weekdays(user_id: int | None = None):
    user_id = user_id or int(get_jwt_identity())
    with get_db_session() as session:
        user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
        if user is None:
            logging.info(
                "Request to data of nonexistent user.",
                stack_info=True,
                extra={"user_id": user_id},
            )
            return jsonify({"reason": "non existent"}), HTTPStatus.NOT_FOUND

        available_days = set(
            session.exec(
                select(AvailableWeekdays.weekday).where(
                    AvailableWeekdays.operator_id == user_id
                )
            ).all()
        )

        return jsonify({
            day.value: day.value in available_days
            for day in WeekdayEnum
        }), HTTPStatus.OK
