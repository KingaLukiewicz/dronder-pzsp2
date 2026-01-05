import os
from typing import Final

JWT_SECRET: Final[str] = os.getenv("JWT_SECRET", "TEST")
JWT_SECRET_KEY: Final[str] = os.getenv("JWT_SECRET_KEY", "TEST")
JWT_ALGORITHM: Final[str] = os.getenv("JWT_ALGORITHM", "HS256")

DEBUG: Final[bool] = bool(os.getenv("DEBUG", False))

DATABASE_URL: Final[str] = (
    "sqlite:///:memory:"
    if DEBUG
    else f"postgresql+psycopg2://{os.getenv('DB_USER', 'USER')}:{
        os.getenv('DB_PASSWORD', 'PASSWORD')
    }@database/{os.getenv('DB_NAME', 'NAME')}"
)
