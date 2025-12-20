from itertools import chain
import logging
from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,  # pyright: ignore[reportUnknownVariableType]
)
from sqlmodel import Session, select

from app.db import get_db_session
from app.forms.user import LocationForm, Review, UserdataForm
from app.models import Groups, Locations, Users as User, Offers as Offer


bp = Blueprint("user", __name__, url_prefix="/user")


def find_user_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == False)
        .where(Groups.client == True)
        .where(Groups.operator == False)
    ).first()


def find_admin_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == True)
        .where(Groups.client == False)
        .where(Groups.operator == False)
    ).first()


def find_operator_group(session: Session):
    return session.exec(
        select(Groups)
        .where(Groups.admin == False)
        .where(Groups.client == False)
        .where(Groups.operator == True)
    ).first()


@bp.get("/data")
@bp.get("/data/<int:user_id>")
@jwt_required()
def get_userdata(user_id: int | None = None):
    user_id = user_id or int(get_jwt_identity())
    session = get_db_session()

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
            lambda t: Review(reviewer=t[0].client.username, rating=t[2], review=t[1]),  # type: ignore
            chain(
                session.exec(
                    select(
                        Offer,
                        Offer.client_review,
                        Offer.client_rating,
                    ).where(Offer.client_id == user_id)
                ).all(),
                # session.exec(
                #     select(Offer.client_review)
                #     .where(Offer.operator_id == user_id) # type: ignore
                #     .where(Offer.client_review != None)  # noqa: E711
                # ).all(),
            ),
        )
    )

    location: LocationForm | None = None
    role: list[str] = []

    print(user.group)

    if user.group.admin:  # pyright: ignore[reportOptionalMemberAccess]
        role.append("admin")
    if user.group.client:  # pyright: ignore[reportOptionalMemberAccess]
        role.append("client")
    if user.group.operator:  # pyright: ignore[reportOptionalMemberAccess]
        role.append("operator")
        location = LocationForm.model_validate(user.location.model_dump())  # type: ignore

    return jsonify(
        UserdataForm.model_validate(
            {
                "username": user.username,
                "description": user.description,
                "reviews": reviews,
                "role": "+".join(role),
                "location": location,
            }
        ).model_dump()
    ), HTTPStatus.OK


@bp.post("/data")
@jwt_required()
def post_userdata():
    user_id: int = int(get_jwt_identity())
    session = get_db_session()

    data = UserdataForm.model_validate(request.json)
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
