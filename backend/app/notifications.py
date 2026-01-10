from collections import Counter
from typing import Any
from flask_socketio import SocketIO, join_room, leave_room, rooms  # pyright: ignore[reportUnknownVariableType]
from flask_jwt_extended import decode_token  # pyright: ignore[reportUnknownVariableType]
from flask import request

from app import app
from app.models import Users

socketio = SocketIO()

connected_users: Counter[int] = Counter()


@socketio.on("connect")
def connect_user(auth: dict[str, Any]):
    try:
        user_id = int(
            decode_token(auth["token"]).get(app.app.config["JWT_IDENTITY_CLAIM"])  # type: ignore
        )
    except Exception as e:
        print(e)
        return False
    join_room(str(user_id))
    connected_users.update([user_id])


@socketio.on("disconnect")
def disconnect_user():
    room = list(filter(lambda name: name != request.sid, rooms()))[0]  # type: ignore
    room = cast(str, room)  # type: ignore
    user_id = int(room)
    leave_room(room)
    connected_users.subtract([user_id])
    if connected_users.get(user_id, 0) <= 0:
        connected_users.pop(user_id)


def push_notifications(user: Users):
    if user.user_id in connected_users.keys():
        socketio.emit("match", {"count": len(user.Matches)}, to=str(user.user_id))  # pyright: ignore[reportUnknownMemberType]
