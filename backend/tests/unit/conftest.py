from datetime import date
from http import HTTPStatus
import random
from flask.testing import FlaskClient
import pytest

from app.app import app
from app.forms.auth import LoginForm, RegisterForm
from app.forms.offer import OfferForm


@pytest.fixture()
def client():
    with app.test_client() as client:
        yield client


def create_test_user(client: FlaskClient) -> tuple[int, str, LoginForm]:
    mail = f"abcd.abcd@abcd{random.randint(1, 10000000000)}.pl"
    name = "Abecadłowki" + str(random.randint(10, 1000))
    data = RegisterForm.model_validate({
        "username":name,
        "email":mail,
        "password":"foobaring",
        "re_password":"foobaring",
        "phone_number":"+48 123 456 789",
    })
    ret = LoginForm(email=mail, password="foobaring")
    response = client.post("/auth/register", json=data.model_dump())
    assert response.status_code == HTTPStatus.CREATED
    return int(response.json["user_id"]), name, ret  # type: ignore


def create_test_offer(client: FlaskClient, access_token: str) -> OfferForm:
    offer = OfferForm.model_validate(
        {
            "description": "Supertesting" + str(object=random.randint(0, 10000)),
            "offer_type": "Ortofotomapa",
            "deadline_date": date(2025, 10, 10).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            "location": {"address": "Sosnowiec", "radius": 250},
            "format": "your mom",
            "parameters": [
                {"name": "exists", "value": "yes"},
                {"name": "happy", "value": "never"},
                {"name": "sad", "value": "always"},
                {
                    "name": str(random.randint(0, 10000)),
                    "value": str(random.randint(0, 10000)),
                },
                {
                    "name": str(random.randint(0, 10000)),
                    "value": str(random.randint(0, 10000)),
                },
            ],
        }
    )
    ret = client.post(
        "/offer/", json=offer.model_dump(), headers=from_token(access_token)
    )
    assert ret.status_code == HTTPStatus.CREATED

    offer.offer_id = ret.json["offer_id"]  # type: ignore
    return offer


def from_token(token: str):
    return {"Authorization": f"Bearer {token}"}


def get_access_token(client: FlaskClient, user: LoginForm) -> str:
    response = client.post("/auth/login", json=user.model_dump())
    return response.json["access_token"]  # type: ignore
