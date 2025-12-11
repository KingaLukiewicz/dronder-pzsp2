import logging
from http import HTTPStatus

from flask import Blueprint, Response, jsonify, request

from flask_jwt_extended import create_access_token  # pyright: ignore[reportUnknownVariableType]
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.config import DEBUG
from app.db import get_db_session
from app.forms.auth import LoginForm, RegisterForm
from app.models.generated_models import Users as User
from app.utils.errors import create_validation_error

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/register", methods=["POST"])
def register_user():
    form: RegisterForm
    session = get_db_session()
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
        # FIX: Look into ORM model creation
        user = User.model_validate(form)  # pyright: ignore[reportUnknownMemberType, reportAttributeAccessIssue]
        session.add(user)
        session.commit()
        session.refresh(user)
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

    session = get_db_session()
    users = session.execute(select(User).order_by(User.email)).scalars()
    return jsonify(users.all())


@bp.route("/login", methods=["POST"])
def login_user():
    form: LoginForm
    session = get_db_session()
    try:
        form = LoginForm(**(request.json or {}))  # pyright: ignore[reportUnknownArgumentType, reportAny]  # noqa: E501
    except ValidationError as e:
        logging.info(f"Bad register_user request form\n{e}")
        return Response(
            e.json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    user = session.scalars(select(User).filter_by(email=form.email)).one_or_none()

    if user is None:
        return "User doen't exists", HTTPStatus.NOT_FOUND

    if user.password != form.password:
        return "Invalid password", HTTPStatus.BAD_REQUEST

    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token), HTTPStatus.OK
