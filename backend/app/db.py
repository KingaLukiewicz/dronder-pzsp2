import os
from sqlalchemy import create_engine, text
from sqlmodel import SQLModel, Field, Session, create_engine, select
from models import Weekday, OfferType, Parameter, TypeParameter, Group

db_url = (
    f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
    f"@localhost:5432/{os.environ['DB_NAME']}"
)

engine = create_engine(db_url)

with Session(engine) as session:
    statement = select(Weekday)
    results = session.exec(statement).all()
    for weekday in results:
        print(weekday.weekday)

    statement = select(OfferType)
    results = session.exec(statement).all()
    for offer_type in results:
        print(offer_type.name)

    statement = select(Parameter)
    results = session.exec(statement).all()
    for parameter in results:
        print(parameter.name)

    statement = select(TypeParameter)
    results = session.exec(statement).all()
    for typeParameter in results:
        print(f"{typeParameter.type_parameters_id} {typeParameter.type_name} {typeParameter.parameter_name}")

    statement = select(Group)
    results = session.exec(statement).all()
    for group in results:
        print(f"{group.group_id} {group.operator} {group.client} {group.admin}")

# with engine.connect() as conn:
#     result = conn.execute(text("SELECT version();"))
#     print(result.fetchone())

   
# from flask_sqlalchemy import SQLAlchemy
# from sqlmodel import SQLModel

# from app.models.user import WorkingWeekday

# db = SQLAlchemy(model_class=SQLModel, engine_options={"echo": True})
