from http import HTTPStatus
import random
from flask.testing import FlaskClient
from phonenumbers import PhoneNumber
from sqlalchemy import Engine
from sqlmodel import SQLModel, Session, create_engine, text
from app.app import app
import pytest

from app.forms.auth import LoginForm, RegisterForm
from app.forms.offer import LocationForm
from app.forms.user import UserdataForm
from app.models import Groups


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def create_test_user(client: FlaskClient) -> tuple[int, LoginForm]:
    mail = f"abcd.abcd@abcd{random.randint(1, 10000000000)}.pl"
    data = RegisterForm(
        username="Abecadłowki",
        email=mail,
        role="client",
        password="foobaring",
        re_password="foobaring",
        phone_number="+48 123 456 789",
    )
    ret = LoginForm(email=mail, password="foobaring")
    response = client.post("/auth/register", json=data.model_dump())
    assert response.status_code == HTTPStatus.CREATED
    return int(response.json["user_id"]), ret  # type: ignore


def from_token(token: str):
    return {"Authorization": f"Bearer {token}"}


def get_access_token(client: FlaskClient, user: LoginForm) -> str:
    response = client.post("/auth/login", json=user.model_dump())
    return response.json["access_token"]  # type: ignore


def test_userdata_endpoints_for_client(client: FlaskClient):
    user_id, login = create_test_user(client)
    access_token = get_access_token(client, login)

    userdata = UserdataForm.model_validate(
        {
            "username": "FooBarXXX",
            "description": "I like flowers",
            "role": "client",
            "location": None,
            "reviews": [],
        }
    )

    res = client.post(
        "/user/data", json=userdata.model_dump(), headers=from_token(access_token)
    )
    assert res.status_code == HTTPStatus.OK

    res = client.get(f"/user/data/{user_id}", headers=from_token(access_token))
    assert res.status_code == HTTPStatus.OK
    assert UserdataForm.model_validate(res.json) == userdata


def test_userdata_endpoints_for_operator(client: FlaskClient):
    user_id, login = create_test_user(client)
    access_token = get_access_token(client, login)

    userdata = UserdataForm.model_validate(
        {
            "username": "FooBarXXX",
            "description": "I like drones",
            "role": "operator",
            "location": LocationForm.model_validate({"address": "Wawa", "radius": 10}),
            "reviews": [],
        }
    )

    res = client.post(
        "/user/data", json=userdata.model_dump(), headers=from_token(access_token)
    )
    assert res.status_code == HTTPStatus.OK

    res = client.get(f"/user/data/{user_id}", headers=from_token(access_token))
    assert res.status_code == HTTPStatus.OK
    assert UserdataForm.model_validate(res.json) == userdata
