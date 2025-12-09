import os
from typing import Final

JWT_SECRET: Final[str] = os.environ["JWT_SECRET"]
JWT_ALGORITHM: Final[str] = os.environ["JWT_ALGORITHM"]

DEBUG: Final[bool] = "DEBUG" in os.environ and os.environ["DEBUG"] == "1"

DATABASE_URL: Final[str] = (
    "sqlite:///:memory:"
    if DEBUG
    else f"postgresql+psycopg2://{os.environ['DB_USER']}:{
        os.environ['DB_PASSWORD']
    }@database/{os.environ['DB_NAME']}"
)
