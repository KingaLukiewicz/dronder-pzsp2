
from sqlmodel import create_engine, SQLModel, Session
import os

from app import config

db_url = config.DATABASE_URL

engine = create_engine(db_url, echo=True)


def init_db():
    SQLModel.metadata.create_all(engine)

    


def get_db_session():
    return Session(engine)
