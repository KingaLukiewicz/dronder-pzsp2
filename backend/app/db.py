import os
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from app.models import Groups, Weekdays, Parameters

db_url = (
    f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
    f"@database:5432/{os.environ['DB_NAME']}"
)

engine = create_engine(db_url)


def get_db_session():
    return Session(engine)


with Session(engine) as session:
    result = session.execute(select(Groups)).scalars().all()
    for group in result:
        print(group.client)

    results = result = session.execute(select(Parameters)).scalars().all()
    for parameter in results:
        print(parameter.name)

    results = result = session.execute(select(Weekdays)).scalars().all()
    for weekday in results:
        print(weekday.weekday)

