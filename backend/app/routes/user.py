import logging
from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,  # pyright: ignore[reportUnknownVariableType]
)
from sqlalchemy.exc import MultipleResultsFound
from sqlmodel import select

from app.db import db
from app.models.user import User

bp = Blueprint("user", __name__, url_prefix="/user")


@bp.route("/aboutme", methods=["GET"])  # pyright: ignore[reportAny]
@jwt_required()  # pyright: ignore[reportAny]
def get_aboutme():
    user_email: str = get_jwt_identity()  # pyright: ignore[reportAny]
    user: User | None
    try:
        user = db.session.execute(
            select(User).where(User.email == user_email)
        ).scalar_one_or_none()
    except MultipleResultsFound:  # NOTE: Impossible (email has UNIQUE constraint in DB)
        logging.critical(
            "Database integrity compromised, aborting.",
            stack_info=True,
            extra={"email": user_email},
        )

        exit(1)

    if user is None:
        logging.error(
            "Unknown user received token. Investigate.",
            stack_info=True,
            extra={"email": user_email},
        )
        return jsonify({"msg": "No user found"}), HTTPStatus.NOT_FOUND

    return jsonify({"aboutme": user.aboutme}), HTTPStatus.OK


@bp.route("/aboutme", methods=["POST"])  # pyright: ignore[reportAny]
@jwt_required()  # pyright: ignore[reportAny]
def set_aboutme():
    user_email: str = get_jwt_identity()  # pyright: ignore[reportAny]
    user: User | None
    try:
        user = db.session.execute(
            select(User).where(User.email == user_email)
        ).scalar_one_or_none()
    except MultipleResultsFound:  # NOTE: Impossible (email has UNIQUE constraint in DB)
        logging.critical(
            "Database integrity compromised, aborting.",
            stack_info=True,
            extra={"email": user_email},
        )

        exit(1)

    if user is None:
        logging.error(
            "Unknown user received token. Investigate.",
            stack_info=True,
            extra={"email": user_email},
        )
        return jsonify({"msg": "No user found"}), HTTPStatus.NOT_FOUND

    user.aboutme = request.json()["content"]
    return HTTPStatus.OK


# @bp.route("/", methods=["POST"])
