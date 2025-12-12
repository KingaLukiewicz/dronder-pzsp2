import pytest
from sqlmodel import SQLModel, create_engine, Session, select
from app.models import Groups, Weekdays, Parameters


@pytest.fixture
def test_engine():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return engine


def test_create_group(test_engine):
    with Session(test_engine) as session:
        group = Groups(group_id=1, client=True, operator=False, admin=True)
        session.add(group)
        session.commit()
        session.refresh(group)

        assert group.group_id == 1
        assert group.client is True
        assert group.operator is False
        assert group.admin is True


def test_insert_and_select_weekday(test_engine):
    with Session(test_engine) as session:
        weekday = Weekdays(weekday="Poniedziałek")
        session.add(weekday)
        session.commit()

        result = session.execute(select(Weekdays)).scalars().all()
        assert len(result) == 1
        assert result[0].weekday == "Poniedziałek"


def test_insert_and_select_parameter(test_engine):
    with Session(test_engine) as session:
        param = Parameters(name="GSD")
        session.add(param)
        session.commit()

        result = session.execute(select(Parameters)).scalars().all()
        assert len(result) == 1
        assert result[0].name == "GSD"

