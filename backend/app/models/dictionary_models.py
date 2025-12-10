from sqlmodel import Field, Relationship, SQLModel 
from dataclasses import dataclass


@dataclass
class Weekday(SQLModel, table=True):
    __tablename__: str = 'Weekdays'  # pyright: ignore[reportIncompatibleVariableOverride]
    weekday: str = Field(primary_key=True, nullable=False, unique=True)


@dataclass
class OfferType(SQLModel, table=True):
    __tablename__: str = 'Offer_Types'  # pyright: ignore[reportIncompatibleVariableOverride]
    name: str = Field(primary_key=True, nullable=False, unique=True)


@dataclass
class Parameter(SQLModel, table=True):
    __tablename__: str = 'Parameters'  # pyright: ignore[reportIncompatibleVariableOverride]
    name: str = Field(primary_key=True, nullable=False, unique=True)


@dataclass
class TypeParameter(SQLModel, table=True):
    __tablename__: str = 'Type_Parameters'  # pyright: ignore[reportIncompatibleVariableOverride]
    type_parameters_id: int | None = Field(default=None, primary_key=True)
    type_name: str = Field(nullable=False, unique=True)
    parameter_name: str = Field(nullable=False, unique=True)