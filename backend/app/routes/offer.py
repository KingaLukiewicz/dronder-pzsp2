from http import HTTPStatus
import logging
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required  # type: ignore
from pydantic import ValidationError
from sqlmodel import Session, select
from app.forms.offer import LocationForm, OfferForm, ParameterForm
from app.matching import MatchingStatus
from app.models import (
    Locations,
    Matches,
    OfferTypes,
    TypeParameters,
    Users as User,
    Offers as Offer,
    OfferParameters as OfferParameter,
    Parameters as Parameter,
)

from app.db import get_db_session


bp = Blueprint("offer", __name__, url_prefix="/offer")


def insert_parameters(session: Session, parameters: list[ParameterForm]):
    for param_form in parameters:
        param: Parameter = Parameter.model_validate({"name": param_form.name})
        if (
            session.exec(select(Parameter).where(Parameter.name == param.name)).first()
            is None
        ):
            session.add(param)


def insert_location(session: Session, location: LocationForm) -> Locations:
    loc = Locations.model_validate(location)
    session.add(loc)
    session.commit()
    session.refresh(loc)
    return loc


def parse_parameters(params: list[OfferParameter]) -> list[ParameterForm]:
    ret: list[ParameterForm] = []
    for param in params:
        ret.append(
            ParameterForm.model_validate(
                {"name": param.parameter_id, "value": param.value}
            )
        )
    return ret


def parse_offer(offer: Offer) -> OfferForm:
    status = "new"

    if any(match.status == MatchingStatus.FINALIZED.value for match in offer.Matches):
        status = "finalized"
    elif any(match.status == MatchingStatus.MATCHED.value for match in offer.Matches):
        status = "matched"

    return OfferForm.model_validate(
        {
            "offer_id": offer.offer_id,
            "description": offer.description,
            "client_id": offer.client_id,
            "client_name": offer.client.username,  # type: ignore
            "offer_type": offer.offer_type,
            "flight_date": offer.flight_date,
            "deadline_date": offer.deadline_date,
            "location": LocationForm.model_validate(offer.location.model_dump()),  # type: ignore
            "format": offer.format,
            "parameters": parse_parameters(offer.Offer_Parameters),
            "status": status,
        }
    )


def attach_parameters(session: Session, offer: Offer, params: list[ParameterForm]):
    for param_form in params:
        name = session.exec(
            select(Parameter).where(Parameter.name == param_form.name)
        ).first()
        assert name is not None

        param = OfferParameter.model_validate(
            {
                "offer_id": offer.offer_id,
                "parameter_id": name.name,
                "value": param_form.value,
            }
        )
        session.add(param)
    session.commit()


@bp.post("/")
@jwt_required()
def post_offer():
    user_id: int = get_jwt_identity()
    with get_db_session() as session:
        user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
        if user is None:
            return jsonify({"reason": "unknown user"}), HTTPStatus.UNAUTHORIZED

        try:
            offer_data = OfferForm.model_validate(request.json)
            insert_parameters(session, offer_data.parameters or [])
        except ValidationError as e:
            return e.json(include_input=False), HTTPStatus.BAD_REQUEST

        offer_data.location_id = insert_location(session, offer_data.location).location_id
        offer_data.client_id = user_id
        offer = Offer.model_validate(offer_data.model_dump())

        session.add(offer)
        session.commit()
        session.refresh(offer)

        attach_parameters(session, offer, offer_data.parameters or [])
        session.commit()
        session.refresh(offer)

        return jsonify({"offer_id": offer.offer_id}), HTTPStatus.CREATED


@bp.get("/")
@bp.get("/<int:offer_id>")
@jwt_required()
def get_offers(offer_id: int | None = None):
    with get_db_session() as session:
        user_id: int = int(get_jwt_identity())

        stmt = select(Offer)
        if offer_id is not None:
            stmt = stmt.where(Offer.offer_id == offer_id)
        else:
            stmt = stmt.where(Offer.client_id == user_id)

        offers = session.exec(stmt).all()
        ret: list[OfferForm] = []

        for offer in offers:
            ret.append(parse_offer(offer))

        return jsonify(ret), HTTPStatus.OK


@bp.get("/ongoing")
@jwt_required()
def get_ongoing_offers():
    with get_db_session() as session:
        user_id: int = int(get_jwt_identity())

        stmt = (
            select(Offer)
            .join(Matches)
            .where(Matches.operator_id == user_id)
            .where(Matches.status == MatchingStatus.MATCHED.value)
        )
        offers = session.exec(stmt).all()
        ret: list[OfferForm] = []

        for offer in offers:
            ret.append(parse_offer(offer))

        return jsonify(ret), HTTPStatus.OK


@bp.get("/finalized")
@jwt_required()
def get_finalized_offers():
    with get_db_session() as session:
        user_id: int = int(get_jwt_identity())

        stmt = (
            select(Offer)
            .join(Matches)
            .where(Matches.operator_id == user_id)
            .where(Matches.status == MatchingStatus.FINALIZED.value)
        )
        offers = session.exec(stmt).all()
        print(offers)
        ret: list[OfferForm] = []

        for offer in offers:
            ret.append(parse_offer(offer))
        print(ret)

        return jsonify(ret), HTTPStatus.OK


@bp.post("/finalized/<int:offer_id>")
@jwt_required()
def finalize_offer(offer_id: int):
    with get_db_session() as session:
        user_id: int = int(get_jwt_identity())

        stmt = (
            select(Matches)
            .join(Offer)
            .where(Matches.operator_id == user_id)
            .where(Matches.status == MatchingStatus.MATCHED.value)
            .where(Offer.offer_id == offer_id)
        )
        match = session.exec(stmt).one_or_none()
        if match is None:
            return "", HTTPStatus.NOT_FOUND
        match.status = MatchingStatus.FINALIZED.value
        session.commit()
        return "", HTTPStatus.OK


@bp.get("/types")
def get_offer_types():
    with get_db_session() as session:
        types = session.exec(select(OfferTypes.name)).all()
        return jsonify(types), HTTPStatus.OK


@bp.get("/parameters/")
@bp.get("/parameters/<string:offer_type>")
def get_parameters_types(offer_type: str | None = None):
    with get_db_session() as session:
        if offer_type is None:
            parameters = session.exec(
                select(TypeParameters.type_name, TypeParameters.parameter_name)
            ).all()
            logging.warning(list(map(lambda row: (row[0], row[1]), parameters)))
            return jsonify(
                list(map(lambda row: (row[0], row[1]), parameters))
            ), HTTPStatus.OK
        else:
            logging.warning(offer_type)
            parameters = session.exec(
                select(TypeParameters.parameter_name).where(
                    TypeParameters.type_name == offer_type
                )
            ).all()
            logging.warning(list(parameters))
            return jsonify(
                list(parameters)
            ), HTTPStatus.OK
