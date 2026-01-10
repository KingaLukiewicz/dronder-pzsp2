from http import HTTPStatus
import logging
from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required  # type: ignore
from sqlmodel import select, func
from typing import List, Tuple, Dict
from datetime import date


from app.db import get_db_session
from app.models import Users as User, Groups as Group, Offers as Offer


bp: Blueprint = Blueprint("admin", __name__, url_prefix="/admin")


@bp.get("/data")
@jwt_required()
def get_admindata():
    user_id = int(get_jwt_identity())
    with get_db_session() as session:
        user = session.exec(select(User).where(User.user_id == user_id)).one_or_none()
        if user is None:
            logging.info(
                "Request to data of nonexistent user.",
                stack_info=True,
                extra={"user_id": user_id},
            )
            return jsonify({"reason": "non existent"}), HTTPStatus.NOT_FOUND
        if not user.group.admin:
            logging.info(
                "Unauthorized admin access attempt",
                stack_info=True,
                extra={"user_id": user_id},
            )
            return jsonify({"reason": "Admin privileges required"}), HTTPStatus.FORBIDDEN

        grouped_users = session.exec(select(User, Group).join(Group)).all()

        admins_count = sum(1 for user, group in grouped_users if group.admin)
        clients_count = sum(1 for user, group in grouped_users if group.client)
        operators_count = sum(1 for user, group in grouped_users if group.operator)

        offer_count = session.exec(select(func.count()).select_from(Offer)).one()

        operator_ratings: List[Tuple[int, int]] = session.exec(
            select(
                Offer.operator_rating,
                func.count(Offer.operator_rating).label("count")  # type: ignore
            )
            .where(Offer.operator_rating is not None)
            .group_by(Offer.operator_rating)  # type: ignore[arg-type]
        ).all()

        operator_rating_stats = {
            rating: count for rating, count in operator_ratings
            if rating is not None
        }

        client_ratings = session.exec(
            select(
                Offer.client_rating,
                func.count(Offer.client_rating).label("count")  # type: ignore
            )
            .where(Offer.client_rating is not None)
            .group_by(Offer.client_rating)  # type: ignore[arg-type]
        ).all()

        client_rating_stats: Dict[int, int] = {
            rating: count for rating, count in client_ratings
            if rating is not None
        }

        offer_by_deadline: List[tuple[date, int]] = session.exec(
            select(  # type: ignore
                Offer.deadline_date,
                func.count().label("count")  # type: ignore[arg-type]
            ).group_by(Offer.deadline_date)
        ).all()

        offer_by_deadline_json: Dict[str, int] = {
           deadline.isoformat(): count for deadline, count in offer_by_deadline
           if deadline is not None
        }

        return jsonify({
                "number_of_admins": admins_count,
                "number_of_clients": clients_count,
                "number_of_operators": operators_count,
                "operator_rating_stats": operator_rating_stats,
                "client_rating_stats": client_rating_stats,
                "number_of_offers": offer_count,
                "number_of_offers_by_deadline": offer_by_deadline_json
            }
        ), HTTPStatus.OK
