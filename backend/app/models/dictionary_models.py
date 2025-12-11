# from __future__ import annotations
# from sqlmodel import Field, Relationship, SQLModel, Table, Column, ForeignKey
# from dataclasses import dataclass
# from typing import List, Optional


# class Weekday(SQLModel, table=True):
#     __tablename__: str = 'Weekdays'  # pyright: ignore[reportIncompatibleVariableOverride]
#     weekday: str = Field(primary_key=True, nullable=False, unique=True)


# type_parameter_table = Table(
#     "Type_Parameters",
#     SQLModel.metadata,
#     Column("type_name", ForeignKey("Offer_Types.name"), primary_key=True),
#     Column("parameter_name", ForeignKey("Parameters.name"), primary_key=True)
# )

# class Parameter(SQLModel, table=True):
#     __tablename__: str = 'Parameters'  # pyright: ignore[reportIncompatibleVariableOverride]
#     name: str = Field(primary_key=True, nullable=False, unique=True)


# class OfferType(SQLModel, table=True):
#     __tablename__: str = 'Offer_Types'  # pyright: ignore[reportIncompatibleVariableOverride]
#     name: str = Field(primary_key=True, nullable=False, unique=True)
#     # parameters: List[Parameter] = Relationship(secondary=ty)

# # class TypeParameter(SQLModel, table=True):
# #     __tablename__: str = 'Type_Parameters'  # pyright: ignore[reportIncompatibleVariableOverride]
# #     type_name_id: str = Field(foreign_key="Offer_Types.name", primary_key=True)
# #     parameter_name_id: str = Field(foreign_key="Parameters.name", primary_key=True)