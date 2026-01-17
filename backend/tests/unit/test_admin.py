from http import HTTPStatus
from flask.testing import FlaskClient
from conftest import create_test_user, from_token, get_access_token

from app.forms.auth import LoginForm


def test_admindata_endpoints_for_not_admin(client: FlaskClient):
    user_id, _, login = create_test_user(client)

    token = get_access_token(client, login)

    response = client.get("/admin/data", headers=from_token(token))
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_admindata_endpoint(client: FlaskClient):
    login = LoginForm(email='marek_lewandowski@gmail.com', password='admin1234')

    token = get_access_token(client, login)

    response = client.get("/admin/data", headers=from_token(token))

    assert response.status_code == HTTPStatus.OK
    assert response.json["number_of_admins"] >= 1
    assert response.json["number_of_operators"] > 3
    assert response.json["number_of_clients"] > 3
    assert response.json["operator_rating_stats"]["5"] >= 5
    assert response.json["client_rating_stats"]["5"] >= 4
    assert response.json["number_of_offers"] > 8
    assert isinstance(response.json["number_of_offers_by_deadline"], dict)
    assert response.json["number_of_offers_by_deadline"]["2024-08-20"] >= 1
