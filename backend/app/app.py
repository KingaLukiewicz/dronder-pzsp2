from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

from .routes import auth
from .config import DATABASE_URL, JWT_ALGORITHM, JWT_SECRET


app = Flask(__name__, instance_relative_config=True)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["JWT_SECRET"] = JWT_SECRET
app.config["JWT_ALGORITHM"] = JWT_ALGORITHM
app.register_blueprint(auth.bp)
db = SQLAlchemy(app)

_ = CORS(app)
_ = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route("/")
def hello_world():
    return "<p>Hi, World!</p>"
