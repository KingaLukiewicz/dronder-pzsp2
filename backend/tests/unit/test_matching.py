from http import HTTPStatus
from random import randint
from flask.testing import FlaskClient

from app.forms.review import ReviewForm
from app.matching import update_all_matches
from tests.unit.conftest import (
    create_test_offer,
    create_test_user,
    from_token,
    get_access_token,
)


def test_order_mathing_sequence(client: FlaskClient):
    operator_id, _, operator_login = create_test_user(client)
    operator_access_token = get_access_token(client, operator_login)
    user_id, _, user_login = create_test_user(client)
    user_access_token = get_access_token(client, user_login)

    offer = create_test_offer(client, user_access_token)
    ret = client.post(
        "/user/data",
        json={"products": ["Ortofotomapa"]},
        headers=from_token(operator_access_token),
    )
    assert ret.status_code == HTTPStatus.OK
    update_all_matches()

    matches = client.get("/matches/offer", headers=from_token(operator_access_token))
    assert matches.status_code == HTTPStatus.OK
    assert any(item["offer_id"] == offer.offer_id for item in matches.json)  # pyright: ignore[reportOptionalIterable, reportOptionalSubscript]
    assert (
        client.post(
            f"/matches/accept/offer/{offer.offer_id}",
            headers=from_token(operator_access_token),
        ).status_code
        == HTTPStatus.OK
    )

    matches = client.get("/matches/operator", headers=from_token(user_access_token))
    assert matches.status_code == HTTPStatus.OK
    assert matches.json[str(offer.offer_id)][0]["user_id"] == operator_id  # pyright: ignore[reportOptionalSubscript]
    assert (
        client.post(
            f"/matches/accept/operator/{offer.offer_id}/{operator_id}",
            headers=from_token(user_access_token),
        ).status_code
        == HTTPStatus.OK
    )

    ongoing = client.get("/offer/ongoing", headers=from_token(operator_access_token))
    assert ongoing.status_code == HTTPStatus.OK
    assert ongoing.json[0]["offer_id"] == offer.offer_id  # pyright: ignore[reportOptionalSubscript]
    assert (
        client.post(
            f"/offer/finalized/{offer.offer_id}",
            headers=from_token(operator_access_token),
        ).status_code
        == HTTPStatus.OK
    )

    finalized = client.get(
        "/offer/finalized", headers=from_token(operator_access_token)
    )
    assert finalized.status_code == HTTPStatus.OK
    assert finalized.json[0]["offer_id"] == offer.offer_id  # pyright: ignore[reportOptionalSubscript]

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

    userdata = client.get(
        f"/user/data/{user_id}", headers=from_token(user_access_token)
    )
    assert userdata.status_code == HTTPStatus.OK

    received: list[ReviewForm] = []

    for r in userdata.json["reviews"]:  # type: ignore
        review = ReviewForm.model_validate(r)
        received.append(review)


    assert received == [review]

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
        headers=from_token(user_access_token),
    )
    assert ret.status_code == HTTPStatus.OK

    userdata = client.get(
        f"/user/data/{operator_id}", headers=from_token(operator_access_token)
    )
    assert userdata.status_code == HTTPStatus.OK

    received: list[ReviewForm] = []

    for r in userdata.json["reviews"]:  # type: ignore
        review = ReviewForm.model_validate(r)
        received.append(review)


    assert received == [review]
