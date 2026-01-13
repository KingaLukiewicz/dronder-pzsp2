from http import HTTPStatus
import logging
from flask import Blueprint, Response, request
from flask_jwt_extended import get_jwt_identity, jwt_required  # type: ignore
from pydantic import ValidationError
from sqlmodel import select

from app.db import get_db_session
from app.forms.review import ReviewForm
from app.matching import MatchingStatus
from app.models import Matches, Offers


bp: Blueprint = Blueprint("review", __name__, url_prefix="/review")


@bp.post("/")
@jwt_required()
def post_review():
    user_id = int(get_jwt_identity())
    with get_db_session() as session:
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
            select(Offers).where(Offers.offer_id == review.offer_id)  # type: ignore
        ).one_or_none()

        if offer is None:
            return "", HTTPStatus.NOT_FOUND

        operator_id = session.exec(
            select(Matches.operator_id)
            .join(Offers)
            .where(offer.offer_id == Matches.offer_id)
            .where(Matches.status == MatchingStatus.FINALIZED.value)
        ).one_or_none()

        if offer.client_id == user_id:
            offer.operator_rating = review.rating
            offer.operator_review = review.review
        elif operator_id == user_id:
            offer.client_rating = review.rating
            offer.client_review = review.review
        else:
            return "", HTTPStatus.BAD_REQUEST

        session.commit()
        return "", HTTPStatus.OK
