from http import HTTPStatus
import logging
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required # type: ignore
from pydantic import ValidationError
from sqlmodel import select

from app.db import get_db_session
from app.forms.review import ReviewForm
from app.models import Offers


bp = Blueprint("review", __name__, url_prefix="/review")


@bp.post("/")
@jwt_required()
def post_review():
    user_id = int(get_jwt_identity())
    session = get_db_session()

    try:
        review = ReviewForm.model_validate(request.json)
    except ValidationError as e:
        logging.info(f"Bad register_user request form\n{e}")
        return Response(
            e.json(include_input=False),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    offer = session.exec(
        select(Offers).where(Offers.offer_id == review.offer_id) # type: ignore
    ).first()
    if offer is None:
        return "nuhuh", HTTPStatus.BAD_REQUEST

    if offer.client_id == user_id:
        offer.operator_rating = review.rating
        offer.operator_review = review.review
    else:
        # TODO: Check if you are the operator
        offer.client_rating = review.rating
        offer.client_review = review.review

    session.commit()
    return jsonify({"msg": "ok"}), HTTPStatus.OK
