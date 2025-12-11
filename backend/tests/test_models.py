from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

import pytest
from app.models import Base, Groups

@pytest.fixture
def test_engine():
    engine = create_engine("sqlite:///:memory:", echo=True)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


def test_insert_and_select_group(test_engine):
    with Session(test_engine) as session:
        group = Groups(group_id=1, client=True, operator=False, admin=False)
        session.add(group)
        session.commit()
        
        result = session.execute(select(Groups)).scalars().all()
        
        assert len(result) == 1
        assert result[0].client is True
        assert result[0].operator is False
        assert result[0].admin is False


# def test_insert_and_select_weekday(test_engine):
#     with Session(test_engine) as session:
#         weekday = Weekday(weekday="Poniedziałek")
#         session.add(weekday)
#         session.commit()
        
#         result = session.exec(select(Weekday)).all()
#         assert len(result) == 1
#         assert result[0].weekday == "Poniedziałek"


# def test_insert_and_select_parameter(test_engine):
#     with Session(test_engine) as session:
#         param = Parameter(name="GSD")
#         session.add(param)
#         session.commit()
        
#         result = session.exec(select(Parameter)).all()
#         assert len(result) == 1
#         assert result[0].name == "GSD"


# def test_insert_and_select_offer_type(test_engine):
#     with Session(test_engine) as session:
#         offer_type = OfferType(name="Ortofotomapa")
#         session.add(offer_type)
#         session.commit()
        
#         result = session.exec(select(OfferType)).all()
#         assert len(result) == 1
#         assert result[0].name == "Ortofotomapa"



