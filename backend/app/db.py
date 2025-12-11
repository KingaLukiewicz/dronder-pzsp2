
from sqlmodel import create_engine, SQLModel, Session
import os

db_url = (
        f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
        f"@localhost:5432/{os.environ['DB_NAME']}"
    )

engine = create_engine(db_url)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_db_session():
    return Session(engine)
