from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from sqlmodel import select
from apscheduler.schedulers.background import BackgroundScheduler  # type: ignore
from app.matching import update_all_matches
from app.notifications import socketio
from app.routes import matches, offer, review, admin

from .routes import auth, user
from .config import DATABASE_URL, JWT_ALGORITHM, JWT_SECRET, JWT_SECRET_KEY
from .db import init_db, get_db_session
from .models import Weekdays

app = Flask(__name__, instance_relative_config=True)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["JWT_SECRET"] = JWT_SECRET
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ALGORITHM"] = JWT_ALGORITHM

app.register_blueprint(auth.bp)
app.register_blueprint(user.bp)
app.register_blueprint(offer.bp)
app.register_blueprint(review.bp)
app.register_blueprint(matches.bp)
app.register_blueprint(admin.bp)

_ = CORS(app)  # type: ignore
_ = JWTManager(app)  # type: ignore

with app.app_context():
    init_db()
    socketio.init_app(app)

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_all_matches, "interval", minutes=1)  # pyright: ignore[reportUnknownMemberType]
    scheduler.start()  # pyright: ignore[reportUnknownMemberType]


@app.route("/")
def hello_world():
    with get_db_session() as session:
        result = session.exec(select(Weekdays)).all()
        return {"result": [item.model_dump() for item in result]}
