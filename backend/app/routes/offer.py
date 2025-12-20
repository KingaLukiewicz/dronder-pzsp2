from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlmodel import Session, select
from app.forms.offer import LocationForm, OfferForm, ParameterForm
from app.models import (
    Users as User,
    Offers as Offer,
    OfferParameters as OfferParameter,
    Parameters as Parameter,
)

from app.db import get_db_session


bp = Blueprint("offer", __name__, url_prefix="/offer")


def insert_parameters(session: Session, parameters: list[ParameterForm]):
    for param in parameters:
        param = Parameter(name=param.name)
        if (
            session.exec(select(Parameter).where(Parameter.name == param.name)).first()
            is None
        ):
            session.add(param)


def parse_parameters(params: list[OfferParameter]) -> list[ParameterForm]:
    ret: list[ParameterForm] = []
    for param in params:
        ret.append(ParameterForm(name=param.parameter_id, value=param.value))
    return ret


def parse_offer(offer: Offer) -> OfferForm:
    return OfferForm(
        offer_id=offer.offer_id,
        description=offer.description,
        client_id=offer.client_id,
        client_name=offer.client.username,  # pyright: ignore[reportOptionalMemberAccess]
        offer_type=offer.offer_type,
        flight_date=offer.flight_date,
        deadline_date=offer.deadline_date,
        location=LocationForm.model_validate(offer.location),
        format=offer.format,
        parameters=parse_parameters(offer.Offer_Parameters),
    )


@bp.post("/")
@jwt_required()
def post_offer():
    user_id: int = get_jwt_identity()
    session = get_db_session()

    user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
    if user is None:
        return jsonify({"reason": "unknown user"}), HTTPStatus.UNAUTHORIZED

    offer_data = OfferForm.model_validate(request.json)
    return jsonify({"offer_id": offer_data.offer_id}), HTTPStatus.OK


@bp.get("/")
@bp.get("/<offer_id:int>")
@jwt_required()
def get_offers(offer_id: int | None = None):
    session = get_db_session()

    stmt = select(Offer)
    if offer_id is not None:
        stmt = stmt.where(Offer.offer_id == offer_id)
    offers = session.exec(stmt).all()
