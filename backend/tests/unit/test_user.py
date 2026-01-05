from http import HTTPStatus
from flask.testing import FlaskClient
from conftest import create_test_user, from_token, get_access_token

from app.forms.offer import LocationForm
from app.forms.user import UserdataForm


def test_userdata_endpoints_for_client(client: FlaskClient):
    user_id, _, login = create_test_user(client)
    access_token = get_access_token(client, login)

    userdata = UserdataForm.model_validate(
        {
            "username": "FooBarXXX",
            "description": "I like flowers",
            "role": "client",
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
    user_id, _, login = create_test_user(client)
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
