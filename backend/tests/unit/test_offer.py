import pytest
from datetime import date
from http import HTTPStatus
from flask.testing import FlaskClient

from app.forms.offer import OfferForm, LocationForm
from tests.unit.conftest import create_test_user, from_token, get_access_token


def test_offer_endpoints(client: FlaskClient):
    user_id, name, login = create_test_user(client)
    access_token = get_access_token(client, login)

    offer = OfferForm.model_validate(
        {
            "description": "Supertesting",
            "offer_type": "Ortofotomapa",
            "deadline_date": date(2025, 11, 10).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            "flight_date": date(2025, 10, 10).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            "location": {"address": "Sosnowiec", "radius": 250},
            "format": "your mom",
            "parameters": [
                {"name": "exists", "value": "yes"},
                {"name": "happy", "value": "never"},
                {"name": "sad", "value": "always"},
            ],
        }
    )

    post_ret = client.post(
        "/offer/", json=offer.model_dump(), headers=from_token(access_token)
    )
    print(post_ret.text)
    assert post_ret.status_code == HTTPStatus.CREATED

    offer.offer_id = post_ret.json["offer_id"]  # type: ignore
    offer.client_id = user_id
    offer.client_name = name

    get_ret = client.get("/offer/", headers=from_token(access_token))
    assert get_ret.status_code == HTTPStatus.OK
    assert len(get_ret.json) == 1  # type: ignore
    assert OfferForm.model_validate(get_ret.json[0]) == offer  # type: ignore


def test_offer_endpoints_wrong_dates(client: FlaskClient):
    with pytest.raises(ValueError):
        OfferForm.model_validate(
            {
                "description": "Supertesting",
                "offer_type": "Ortofotomapa",
                "deadline_date": date(2024, 10, 10).strftime("%a, %d %b %Y %H:%M:%S GMT"),
                "flight_date": date(2025, 10, 10).strftime("%a, %d %b %Y %H:%M:%S GMT"),
                "location": {"address": "Sosnowiec", "radius": 250},
                "format": "your mom",
                "parameters": [
                    {"name": "exists", "value": "yes"},
                    {"name": "happy", "value": "never"},
                    {"name": "sad", "value": "always"},
                ],
            }
        )


def test_offer_endpoints_wrong_location(client: FlaskClient):
    with pytest.raises(ValueError):
        LocationForm.model_validate(
            {
                "geo_latitude": 200,
                "geo_longitude": 100,
                "radius": 250
            }
        )

    with pytest.raises(ValueError):
        LocationForm.model_validate(
            {
                "geo_latitude": 50,
                "geo_longitude": 100,
                "radius": -10
            }
        )

    with pytest.raises(ValueError):
        LocationForm.model_validate(
            {
                "geo_latitude": 50,
                "geo_longitude": 200,
                "radius": 250
            }
        )
