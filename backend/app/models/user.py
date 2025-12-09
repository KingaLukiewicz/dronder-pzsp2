import calendar
from dataclasses import dataclass
from enum import Enum
from typing import Self

from flask_sqlalchemy import SQLAlchemy
from pydantic import model_validator
from pydantic_extra_types.phone_numbers import PhoneNumber
from sqlmodel import Field, Relationship, SQLModel  # pyright: ignore[reportUnknownVariableType]

from app.utils.errors import create_validation_error


class UserDayLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="users.id", primary_key=True)
    weekday_id: int | None = Field(
        default=None, foreign_key="working_weekdays.id", primary_key=True
    )


class UserGroup(str, Enum):
    operator = "operator"
    client = "client"
    admin = "admin"
    operator_and_client = f"{operator}+{client}"

    def needs_phone_number(self) -> bool:
        return self in [self.operator, self.client, self.operator_and_client]


class PLPhone(PhoneNumber):
    default_region: str = "PL"


class WorkingWeekday(SQLModel, table=True):
    __tablename__: str = "working_weekdays"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: int | None = Field(primary_key=True, default=None)
    name: str = Field(nullable=False, unique=True)

    users: list["User"] = Relationship(  # pyright: ignore[reportAny]
        back_populates="working_days", link_model=UserDayLink
    )

    @model_validator(mode="after")
    def is_valid_weekday(self) -> Self:
        if self.name not in calendar.day_name:
            raise create_validation_error(
                self, "value_error", "Provided name is not valid weekday", "name"
            )
        return self

    @staticmethod
    def populate_table(db: SQLAlchemy) -> None:
        for day in calendar.day_name:
            weekday = WorkingWeekday(name=day)
            db.session.add(weekday)
        db.session.commit()


@dataclass
class User(SQLModel, table=True):
    __tablename__: str = "users"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: int | None = Field(primary_key=True, default=None)
    group_id: UserGroup = Field(nullable=False)

    phone_number: PLPhone | None = Field(nullable=True)
    email: str = Field(nullable=False, unique=True)
    password: str = Field(nullable=False)
    first_name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)
    aboutme: str | None = Field(nullable=True, default="<none>")

    working_days: list[WorkingWeekday] = Relationship(  # pyright: ignore[reportAny]
        back_populates="users", link_model=UserDayLink
    )

    @model_validator(mode="after")
    def operator_and_client_needs_phone_number(self) -> Self:
        if self.group_id.needs_phone_number() and self.phone_number is None:
            raise create_validation_error(
                self,
                "integrity_error",
                "Operators and Clients need phone number",
                "phone_number",
            )

        return self
