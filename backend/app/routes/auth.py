import logging
from http import HTTPStatus

from flask import Blueprint, Response, jsonify, request
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.config import DEBUG
from app.db import db
from app.forms.auth import LoginForm, RegisterForm
from app.models.user import User
from app.utils.errors import create_validation_error
from flask_jwt_extended import create_access_token  # pyright: ignore[reportUnknownVariableType]

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/register", methods=["POST"])
def register_user():
    form: RegisterForm
    try:
        form = RegisterForm(**(request.json or {}))  # pyright: ignore[reportUnknownArgumentType, reportAny]  # noqa: E501
    except ValidationError as e:
        logging.info(f"Bad register_user request form\n{e}")
        return Response(
            e.json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    try:
        user = User.model_validate(form)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
    except IntegrityError:
        return Response(
            create_validation_error(
                form,
                "integrity_error",
                "account with provided email already exists",
                "email",
            ).json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    return jsonify(user.model_dump()), HTTPStatus.CREATED


@bp.route("/list", methods=["GET"])
def list_users():
    if not DEBUG:
        return "ndebug", HTTPStatus.FORBIDDEN

    users = db.session.execute(select(User).order_by(User.email)).scalars()
    return jsonify(users.all())


@bp.route("/login", methods=["POST"])
def login_user():
    form: LoginForm
    try:
        form = LoginForm(**(request.json or {}))  # pyright: ignore[reportUnknownArgumentType, reportAny]  # noqa: E501
    except ValidationError as e:
        logging.info(f"Bad register_user request form\n{e}")
        return Response(
            e.json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    user = db.session.scalars(select(User).filter_by(email=form.email)).one_or_none()

    if user is None:
        return "User doen't exists", HTTPStatus.NOT_FOUND

    if user.password != form.password:
        return "Invalid password", HTTPStatus.BAD_REQUEST

    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token), HTTPStatus.OK
