from flask_sqlalchemy import SQLAlchemy
from sqlmodel import SQLModel

from app.models.user import WorkingWeekday

db = SQLAlchemy(model_class=SQLModel, engine_options={"echo": True})


def prepare_database(db: SQLAlchemy):
    WorkingWeekday.populate_table(db)
