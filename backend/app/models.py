from typing import Optional
import datetime
import decimal

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    Date,
    ForeignKeyConstraint,
    Identity,
    Numeric,
    PrimaryKeyConstraint,
    SmallInteger,
    Text,
)
from sqlmodel import Field, Relationship, SQLModel


class Groups(SQLModel, table=True):
    __tablename__ = "Groups"
    __table_args__ = (PrimaryKeyConstraint("group_id", name="Groups_pkey"),)

    group_id: int | None = Field(
        sa_column=Column("group_id", BigInteger, Identity(), primary_key=True),
        default=None,
    )
    client: bool = Field(sa_column=Column("client", Boolean, nullable=False))
    operator: bool = Field(sa_column=Column("operator", Boolean, nullable=False))
    admin: bool = Field(sa_column=Column("admin", Boolean, nullable=False))

    Users: list["Users"] = Relationship(back_populates="group")


class Locations(SQLModel, table=True):
    __tablename__ = "Locations"
    __table_args__ = (
        CheckConstraint(
            "address IS NOT NULL OR geo_longitude IS NOT NULL AND geo_latitude IS NOT NULL AND radius IS NOT NULL",
            name="check_locations",
        ),
        PrimaryKeyConstraint("location_id", name="Locations_pkey"),
    )

    location_id: int | None = Field(
        sa_column=Column("location_id", BigInteger, Identity(), primary_key=True),
        default=None,
    )
    geo_longitude: Optional[decimal.Decimal] = Field(
        default=None, sa_column=Column("geo_longitude", Numeric(9, 6))
    )
    geo_latitude: Optional[decimal.Decimal] = Field(
        default=None, sa_column=Column("geo_latitude", Numeric(9, 6))
    )
    radius: Optional[int] = Field(default=None, sa_column=Column("radius", BigInteger))
    address: Optional[str] = Field(default=None, sa_column=Column("address", Text))

    Users: list["Users"] = Relationship(back_populates="location")
    Offers: list["Offers"] = Relationship(back_populates="location")


class Weekdays(SQLModel, table=True):
    __tablename__ = "Weekdays"
    __table_args__ = (PrimaryKeyConstraint("weekday", name="Weekdays_pkey"),)

    weekday: str = Field(sa_column=Column("weekday", Text, primary_key=True))

    Available_Weekdays: list["AvailableWeekdays"] = Relationship(
        back_populates="Weekdays_"
    )


class OfferTypes(SQLModel, table=True):
    __tablename__ = "Offer_Types"
    __table_args__ = (PrimaryKeyConstraint("name", name="Offer_Types_pkey"),)

    name: str = Field(sa_column=Column("name", Text, primary_key=True))

    Offers: list["Offers"] = Relationship(back_populates="Offer_Types")


class Parameters(SQLModel, table=True):
    __tablename__ = "Parameters"
    __table_args__ = (PrimaryKeyConstraint("name", name="Parameters_pkey"),)

    name: str = Field(sa_column=Column("name", Text, primary_key=True))

    Offer_Parameters: list["OfferParameters"] = Relationship(back_populates="parameter")


class TypeParameters(SQLModel, table=True):
    __tablename__ = "Type_Parameters"
    type_name: str = Field(foreign_key="Offer_Types.name", primary_key=True)
    parameter_name: str = Field(foreign_key="Parameters.name", primary_key=True)


Parameters.Offer_Types = Relationship(
    back_populates="Parameters", link_model=TypeParameters
)
OfferTypes.Parameters = Relationship(
    back_populates="Offer_Types", link_model=TypeParameters
)


class Users(SQLModel, table=True):
    __tablename__ = "Users"
    __table_args__ = (
        ForeignKeyConstraint(
            ["group_id"], ["Groups.group_id"], name="Users_group_id_fkey"
        ),
        ForeignKeyConstraint(
            ["location_id"], ["Locations.location_id"], name="Users_location_id_fkey"
        ),
        PrimaryKeyConstraint("user_id", name="Users_pkey"),
    )

    user_id: int | None = Field(
        sa_column=Column(
            "user_id", BigInteger, Identity(), primary_key=True, default=None
        ),
        default=None,
    )
    email: str = Field(sa_column=Column("email", Text, nullable=False))
    username: str = Field(sa_column=Column("username", Text, nullable=False))
    password: str = Field(sa_column=Column("password", Text, nullable=False))
    phone_number: str = Field(sa_column=Column("phone_number", Text, nullable=False))
    group_id: int | None = Field(
        sa_column=Column("group_id", BigInteger, nullable=True, default=None),
        default=None,
    )
    location_id: Optional[int] = Field(
        default=None, sa_column=Column("location_id", BigInteger, nullable=True)
    )

    description: str = Field(default="")

    group: Optional["Groups"] = Relationship(back_populates="Users")
    location: Optional["Locations"] = Relationship(back_populates="Users")
    Available_Weekdays: list["AvailableWeekdays"] = Relationship(
        back_populates="operator"
    )
    Offers: list["Offers"] = Relationship(back_populates="client")
    Matches: list["Matches"] = Relationship(back_populates="operator")


class AvailableWeekdays(SQLModel, table=True):
    __tablename__ = "Available_Weekdays"
    __table_args__ = (
        ForeignKeyConstraint(
            ["operator_id"],
            ["Users.user_id"],
            name="Available_Weekdays_operator_id_fkey",
        ),
        ForeignKeyConstraint(
            ["weekday"], ["Weekdays.weekday"], name="Available_Weekdays_weekday_fkey"
        ),
        PrimaryKeyConstraint("available_weekends_id", name="Available_Weekdays_pkey"),
    )

    available_weekends_id: int = Field(
        sa_column=Column(
            "available_weekends_id", BigInteger, Identity(), primary_key=True
        )
    )
    weekday: str = Field(sa_column=Column("weekday", Text, nullable=False))
    operator_id: int = Field(
        sa_column=Column("operator_id", BigInteger, nullable=False)
    )

    operator: Optional["Users"] = Relationship(back_populates="Available_Weekdays")
    Weekdays_: Optional["Weekdays"] = Relationship(back_populates="Available_Weekdays")


class Offers(SQLModel, table=True):
    __tablename__ = "Offers"
    __table_args__ = (
        CheckConstraint(
            "client_rating >= 1 AND client_rating <= 5",
            name="Offers_client_rating_check",
        ),
        CheckConstraint(
            "operator_rating >= 1 AND operator_rating <= 5",
            name="Offers_operator_rating_check",
        ),
        ForeignKeyConstraint(
            ["client_id"], ["Users.user_id"], name="Offers_client_id_fkey"
        ),
        ForeignKeyConstraint(
            ["location_id"], ["Locations.location_id"], name="Offers_location_id_fkey"
        ),
        ForeignKeyConstraint(
            ["offer_type"], ["Offer_Types.name"], name="Offers_offer_type_fkey"
        ),
        PrimaryKeyConstraint("offer_id", name="Offers_pkey"),
    )

    offer_id: int | None = Field(
        sa_column=Column(
            "offer_id", BigInteger, Identity(), primary_key=True, default=None
        ),
        default=None,
    )
    location_id: int = Field(
        sa_column=Column("location_id", BigInteger, nullable=False)
    )
    client_id: int = Field(sa_column=Column("client_id", BigInteger, nullable=False))
    offer_type: str = Field(sa_column=Column("offer_type", Text, nullable=False))
    description: str = Field(sa_column=Column("description", Text, nullable=False))
    deadline_date: datetime.date = Field(
        sa_column=Column("deadline_date", Date, nullable=False)
    )
    status: str = Field(sa_column=Column("status", Text, nullable=False))
    match_id: Optional[int] = Field(
        default=None, sa_column=Column("match_id", BigInteger)
    )
    format: Optional[str] = Field(default=None, sa_column=Column("format", Text))
    flight_date: Optional[datetime.date] = Field(
        default=None, sa_column=Column("flight_date", Date)
    )
    operator_rating: Optional[int] = Field(
        default=None, sa_column=Column("operator_rating", SmallInteger)
    )
    operator_review: Optional[str] = Field(
        default=None, sa_column=Column("operator_review", Text)
    )
    client_rating: Optional[int] = Field(
        default=None, sa_column=Column("client_rating", SmallInteger)
    )
    client_review: Optional[str] = Field(
        default=None, sa_column=Column("client_review", Text)
    )

    client: Optional["Users"] = Relationship(back_populates="Offers")
    location: Optional["Locations"] = Relationship(back_populates="Offers")
    Offer_Types: Optional["OfferTypes"] = Relationship(back_populates="Offers")
    Matches: list["Matches"] = Relationship(back_populates="offer")
    Offer_Parameters: list["OfferParameters"] = Relationship(back_populates="offer")


class Matches(SQLModel, table=True):
    __tablename__ = "Matches"
    __table_args__ = (
        ForeignKeyConstraint(
            ["offer_id"], ["Offers.offer_id"], name="Matches_offer_id_fkey"
        ),
        ForeignKeyConstraint(
            ["operator_id"], ["Users.user_id"], name="Matches_operator_id_fkey"
        ),
        PrimaryKeyConstraint("match_id", name="Matches_pkey"),
    )

    match_id: int | None = Field(
        sa_column=Column("match_id", BigInteger, Identity(), primary_key=True, default=None),
        default=None
    )
    status: str = Field()
    operator_id: int = Field(
        sa_column=Column("operator_id", BigInteger, nullable=False)
    )
    offer_id: int = Field(sa_column=Column("offer_id", BigInteger, nullable=False))

    offer: Optional["Offers"] = Relationship(back_populates="Matches")
    operator: Optional["Users"] = Relationship(back_populates="Matches")


class OfferParameters(SQLModel, table=True):
    __tablename__ = "Offer_Parameters"
    __table_args__ = (
        ForeignKeyConstraint(
            ["offer_id"], ["Offers.offer_id"], name="Offer_Parameters_offer_id_fkey"
        ),
        ForeignKeyConstraint(
            ["parameter_id"],
            ["Parameters.name"],
            name="Offer_Parameters_parameter_id_fkey",
        ),
        PrimaryKeyConstraint("offer_parameters_id", name="Offer_Parameters_pkey"),
    )

    offer_parameters_id: int | None = Field(
        sa_column=Column(
            "offer_parameters_id",
            BigInteger,
            Identity(),
            primary_key=True,
            default=None,
        ),
        default=None,
    )
    offer_id: int = Field(sa_column=Column("offer_id", BigInteger, nullable=False))
    parameter_id: str = Field(sa_column=Column("parameter_id", Text, nullable=False))
    value: str = Field(sa_column=Column("value", Text, nullable=False))

    offer: Optional["Offers"] = Relationship(back_populates="Offer_Parameters")
    parameter: Optional["Parameters"] = Relationship(back_populates="Offer_Parameters")


class OperatorProducts(SQLModel, table=True):
    __tablename__ = "Operator_Products"

    operator_products_id: int | None = Field(default=None, primary_key=True)
    operator_id: int = Field(foreign_key="Users.user_id")
    offer_type_name: str = Field(foreign_key="Offer_Types.name")