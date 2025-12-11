import pytest
import os
from sqlmodel import create_engine, text, SQLModel, select, Session
from app.models import Weekdays


@pytest.fixture
def test_postgres():
    engine = create_engine(
        f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
        f"@localhost:5432/{os.environ['DB_NAME']}"
    )

    return engine


def test_weekdays_not_empty(test_postgres):
    with Session(test_postgres) as session:
        result = session.exec(select(Weekdays))

        assert len(result.all()) == 7
