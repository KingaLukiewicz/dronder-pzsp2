import pytest
import os
from sqlalchemy import create_engine, select, exists
from sqlalchemy.orm import Session
from app.models import Base, Weekdays


@pytest.fixture
def test_postgres():
    engine = create_engine(
        f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
        f"@localhost:5432/{os.environ['DB_NAME']}"
    )

    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


def test_weekdays_not_empty(test_postgres):
    engine = test_postgres

    with Session(engine) as session:
        stmt = select(exists().where(Weekdays.weekday.isnot(None)))
        result = session.execute(stmt).scalar()

        assert result is True
