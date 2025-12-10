from sqlalchemy import create_engine

db_url = f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}@" \
         f"@localhost:5432//{os.environ['DB_NAME']}"

engine = create_engine(db_url)

with engine.connect() as conn:
   result = conn.execute("SELECT version();")
   print(result.fetchone())
   
# from flask_sqlalchemy import SQLAlchemy
# from sqlmodel import SQLModel

# from app.models.user import WorkingWeekday

# db = SQLAlchemy(model_class=SQLModel, engine_options={"echo": True})


def prepare_database(db: SQLAlchemy):
    WorkingWeekday.populate_table(db)
