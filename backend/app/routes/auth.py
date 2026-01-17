import logging
from http import HTTPStatus

from flask import Blueprint, Response, jsonify, request
from flask_bcrypt import Bcrypt  # type: ignore

from flask_jwt_extended import create_access_token  # pyright: ignore[reportUnknownVariableType]
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.config import DEBUG
from app.db import get_db_session
from app.forms.auth import LoginForm, RegisterForm
from app.models import Users as User
from app.routes.user import find_admin_group, find_operator_group, find_user_group

bp: Blueprint = Blueprint("auth", __name__, url_prefix="/auth")
bcrypt = Bcrypt()

@bp.route("/register", methods=["POST"])
def register_user():
    form: RegisterForm
    session = get_db_session()
    try:
        form = RegisterForm.model_validate(request.json)
        user = User.model_validate(form)
    except ValidationError as e:
        logging.info(f"Bad register_user request form\n{e}")
        return Response(
            e.json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    try:
        match form.role:  # type: ignore
            case "client":
                user.group = find_user_group(session)
                user.group_id = user.group.group_id  # type: ignore
            case "admin":
                user.group = find_admin_group(session)
                user.group_id = user.group.group_id  # type: ignore
            case "operator":
                user.group = find_operator_group(session)
                user.group_id = user.group.group_id  # type: ignore

        user.group = find_user_group(session)
        user.group_id = user.group.group_id  # type: ignore

        user.password = bcrypt.generate_password_hash(user.password).decode('utf-8')
        session.add(user)
        session.commit()
        session.refresh(user)
    except IntegrityError as e:
        return Response(
            repr(e),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    return jsonify({"user_id": user.user_id}), HTTPStatus.CREATED


@bp.route("/list", methods=["GET"])
def list_users():
    if not DEBUG:
        return "ndebug", HTTPStatus.FORBIDDEN

    session = get_db_session()
    users = session.exec(select(User).order_by(User.email)).all()
    return jsonify(users)


@bp.route("/login", methods=["POST"])
def login_user():
    form: LoginForm
    session = get_db_session()
    try:
        form = LoginForm.model_validate(request.json)
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

    if not bcrypt.check_password_hash(user.password, form.password):
        return "Invalid password", HTTPStatus.BAD_REQUEST

    access_token = create_access_token(identity=str(user.user_id))
    return jsonify(access_token=access_token), HTTPStatus.OK
