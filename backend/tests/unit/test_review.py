from http import HTTPStatus
from itertools import product
from random import randint
from flask.testing import FlaskClient

from app.routes.review import ReviewForm
from tests.unit.conftest import (
    create_test_offer,
    create_test_user,
    from_token,
    get_access_token,
)


def test_review_endpoints(client: FlaskClient):
    client_id, client_name, login = create_test_user(client)
    client_access_token = get_access_token(client, login)

    offers = [
        create_test_offer(client, client_access_token),
        create_test_offer(client, client_access_token),
        create_test_offer(client, client_access_token),
    ]

    reviews: list[ReviewForm] = []

    for offer in offers:
        _, operator_name, login = create_test_user(client)
        operator_access_token = get_access_token(client, login)

        review = ReviewForm.model_validate(
            {
                "offer_id": offer.offer_id,
                "rating": randint(1, 5),
                "review": str(randint(100, 1000000)) * 10,
            }
        )
        ret = client.post(
            "/review/",
            json=review.model_dump(),
            headers=from_token(operator_access_token),
        )
        assert ret.status_code == HTTPStatus.OK

        review.reviewer = client_name
        reviews.append(review)

    userdata = client.get(
        f"/user/data/{client_id}", headers=from_token(client_access_token)
    )
    assert userdata.status_code == HTTPStatus.OK

    received: list[ReviewForm] = []

    for r in userdata.json["reviews"]:  # type: ignore
        review = ReviewForm.model_validate(r)
        received.append(review)

    received.sort(key=lambda x: x.offer_id or 0)
    reviews.sort(key=lambda x: x.offer_id or 0)

    assert received == reviews
