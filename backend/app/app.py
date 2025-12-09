from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlmodel import select

from app.models.user import WorkingWeekday

from .routes import auth
from .config import DATABASE_URL, DEBUG, JWT_ALGORITHM, JWT_SECRET
from .db import db, prepare_database


app = Flask(__name__, instance_relative_config=True)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["JWT_SECRET"] = JWT_SECRET
app.config["JWT_ALGORITHM"] = JWT_ALGORITHM
app.register_blueprint(auth.bp)
db.init_app(app)
_ = CORS(app)
_ = JWTManager(app)

with app.app_context():
    db.create_all()
    prepare_database(db)

    if DEBUG:
        print(*db.session.execute(select(WorkingWeekday)).all(), sep="\n")


@app.route("/")
def hello_world():
    return "<p>Hi, World!</p>"
