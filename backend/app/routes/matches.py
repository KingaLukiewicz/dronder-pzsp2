from http import HTTPStatus
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity  # pyright: ignore[reportUnknownVariableType]
from sqlmodel import select

from app.db import get_db_session
from app.forms.offer import OfferForm
from app.forms.user import UserdataForm
from app.matching import MatchingStatus
from app.models import Matches, Offers, Users
from app.routes.offer import parse_offer  # pyright: ignore[reportUnknownVariableType]

bp: Blueprint = Blueprint("matches", __name__, url_prefix="/matches")


@bp.get("/offer")
@jwt_required()
def get_offer_matches():
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        ret: list[OfferForm] = []
        for offer in session.exec(
            select(Offers)
            .join(Matches)
            .join(Users)
            .where(Users.user_id == user_id)
            .where(Matches.status == MatchingStatus.PENDING.value)
            .distinct()
        ).all():
            ret.append(OfferForm.model_validate(parse_offer(offer)))

        return jsonify(ret), HTTPStatus.OK


@bp.get("/operator")
@jwt_required()
def get_operator_matches():
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        ret: dict[int, list[UserdataForm]] = {}
        for offer, user in session.exec(
            select(Offers, Users)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.client_id == user_id)
            .where(Matches.status == MatchingStatus.INTERESTED.value)
            .distinct()
        ).all():
            assert offer.offer_id is not None
            ret.setdefault(offer.offer_id, []).append(
                UserdataForm.model_validate(user.model_dump())
            )
        return jsonify(ret), HTTPStatus.OK


@bp.post("/accept/offer/<int:offer_id>")
@jwt_required()
def accept_offer(offer_id: int):
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        match = session.exec(
            select(Matches)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.offer_id == offer_id)
            .where(Users.user_id == user_id)
        ).one_or_none()

        if match is None:
            return "", HTTPStatus.NOT_FOUND
        match.status = MatchingStatus.INTERESTED.value
        session.commit()
        return "", HTTPStatus.OK


@bp.post("/decline/offer/<int:offer_id>")
@jwt_required()
def decline_offer(offer_id: int):
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        match = session.exec(
            select(Matches)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.offer_id == offer_id)
            .where(Users.user_id == user_id)
        ).one_or_none()

        if match is None:
            return "", HTTPStatus.NOT_FOUND
        match.status = MatchingStatus.NOT_INTERESTED.value
        session.commit()
        return "", HTTPStatus.OK


@bp.post("/accept/operator/<int:offer_id>/<int:operator_id>")
@jwt_required()
def accept_operator(offer_id: int, operator_id: int):
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        match = session.exec(
            select(Matches)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.client_id == user_id)
            .where(Offers.offer_id == offer_id)
            .where(Users.user_id == operator_id)
        ).one_or_none()

        if match is None:
            return "", HTTPStatus.NOT_FOUND
        match.status = MatchingStatus.MATCHED.value

        for discarded in session.exec(
            select(Matches)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.client_id == user_id)
            .where(Offers.offer_id == offer_id)
            .where(Users.user_id != operator_id)
        ).all():
            session.delete(discarded)

        session.commit()
        return "", HTTPStatus.OK


@bp.post("/decline/operator/<int:offer_id>/<int:operator_id>")
@jwt_required()
def decline_operator(offer_id: int, operator_id: int):
    user_id: int = int(get_jwt_identity())
    with get_db_session() as session:
        match = session.exec(
            select(Matches)
            .select_from(Offers)
            .join(Matches)
            .join(Users)
            .where(Offers.client_id == user_id)
            .where(Offers.offer_id == offer_id)
            .where(Users.user_id == operator_id)
        ).one_or_none()

        if match is None:
            return "", HTTPStatus.NOT_FOUND

        match.status = MatchingStatus.NOT_INTERESTED.value
        session.commit()
        return "", HTTPStatus.OK
