from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from sqlmodel import select

from .routes import auth
from .config import DATABASE_URL, JWT_ALGORITHM, JWT_SECRET
from .db import init_db, get_db_session
from .models import Weekdays

app = Flask(__name__, instance_relative_config=True)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["JWT_SECRET"] = JWT_SECRET
app.config["JWT_ALGORITHM"] = JWT_ALGORITHM
app.register_blueprint(auth.bp)


_ = CORS(app)
_ = JWTManager(app)

with app.app_context():
    init_db()


@app.route("/")
def hello_world():
    with get_db_session() as session:
        result = session.exec(select(Weekdays)).all()
        return {"result": [item.model_dump() for item in result]}
