from typing import Optional
import datetime
import decimal

from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, Date, ForeignKeyConstraint, Identity, Numeric, PrimaryKeyConstraint, SmallInteger, Table, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlmodel import SQLModel

class Base(DeclarativeBase):
    pass


class Groups(Base):
    __tablename__ = 'Groups'  # pyright: ignore[reportUnannotatedClassAttribute, reportAssignmentType]
    __table_args__ = (  # pyright: ignore[reportUnannotatedClassAttribute]
        PrimaryKeyConstraint('group_id', name='Groups_pkey'),
    )

    group_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    client: Mapped[bool] = mapped_column(Boolean, nullable=False)
    operator: Mapped[bool] = mapped_column(Boolean, nullable=False)
    admin: Mapped[bool] = mapped_column(Boolean, nullable=False)

    Users: Mapped[list['Users']] = relationship('Users', back_populates='group')


class Locations(Base):
    __tablename__ = 'Locations'  # pyright: ignore[reportAssignmentType, reportUnannotatedClassAttribute]
    __table_args__ = (  # pyright: ignore[reportUnannotatedClassAttribute]
        CheckConstraint('address IS NOT NULL OR geo_longitude IS NOT NULL AND geo_latitude IS NOT NULL AND radius IS NOT NULL', name='check_locations'),
        PrimaryKeyConstraint('location_id', name='Locations_pkey')
    )

    location_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    geo_longitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(9, 6))
    geo_latitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(9, 6))
    radius: Mapped[Optional[int]] = mapped_column(BigInteger)
    address: Mapped[Optional[str]] = mapped_column(Text)

    Users: Mapped[list['Users']] = relationship('Users', back_populates='location')
    Offers: Mapped[list['Offers']] = relationship('Offers', back_populates='location')


class OfferTypes(Base):
    __tablename__ = 'Offer_Types'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        PrimaryKeyConstraint('name', name='Offer_Types_pkey'),
    )

    name: Mapped[str] = mapped_column(Text, primary_key=True)

    Parameters: Mapped[list['Parameters']] = relationship('Parameters', secondary='Type_Parameters', back_populates='Offer_Types')
    Offers: Mapped[list['Offers']] = relationship('Offers', back_populates='Offer_Types')


class Parameters(Base):
    __tablename__ = 'Parameters'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        PrimaryKeyConstraint('name', name='Parameters_pkey'),
    )

    name: Mapped[str] = mapped_column(Text, primary_key=True)

    Offer_Types: Mapped[list['OfferTypes']] = relationship('OfferTypes', secondary='Type_Parameters', back_populates='Parameters')
    Offer_Parameters: Mapped[list['OfferParameters']] = relationship('OfferParameters', back_populates='parameter')


class Weekdays(Base):
    __tablename__ = 'Weekdays'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        PrimaryKeyConstraint('weekday', name='Weekdays_pkey'),
    )

    weekday: Mapped[str] = mapped_column(Text, primary_key=True)

    Available_Weekdays: Mapped[list['AvailableWeekdays']] = relationship('AvailableWeekdays', back_populates='Weekdays_')


t_Type_Parameters = Table(
    'Type_Parameters', Base.metadata,
    Column('type_name', Text, primary_key=True),
    Column('parameter_name', Text, primary_key=True),
    ForeignKeyConstraint(['parameter_name'], ['Parameters.name'], name='Type_Parameters_parameter_name_fkey'),
    ForeignKeyConstraint(['type_name'], ['Offer_Types.name'], name='Type_Parameters_type_name_fkey'),
    PrimaryKeyConstraint('type_name', 'parameter_name', name='Type_Parameters_pkey')
)


class Users(Base):
    __tablename__ = 'Users'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        ForeignKeyConstraint(['group_id'], ['Groups.group_id'], name='Users_group_id_fkey'),
        ForeignKeyConstraint(['location_id'], ['Locations.location_id'], name='Users_location_id_fkey'),
        PrimaryKeyConstraint('user_id', name='Users_pkey')
    )

    user_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    email: Mapped[str] = mapped_column(Text, nullable=False)
    username: Mapped[str] = mapped_column(Text, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    phone_number: Mapped[str] = mapped_column(Text, nullable=False)
    group_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    location_id: Mapped[Optional[int]] = mapped_column(BigInteger)

    group: Mapped['Groups'] = relationship('Groups', back_populates='Users')
    location: Mapped[Optional['Locations']] = relationship('Locations', back_populates='Users')
    Available_Weekdays: Mapped[list['AvailableWeekdays']] = relationship('AvailableWeekdays', back_populates='operator')
    Offers: Mapped[list['Offers']] = relationship('Offers', back_populates='client')
    Matches: Mapped[list['Matches']] = relationship('Matches', back_populates='operator')


class AvailableWeekdays(Base):
    __tablename__ = 'Available_Weekdays'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        ForeignKeyConstraint(['operator_id'], ['Users.user_id'], name='Available_Weekdays_operator_id_fkey'),
        ForeignKeyConstraint(['weekday'], ['Weekdays.weekday'], name='Available_Weekdays_weekday_fkey'),
        PrimaryKeyConstraint('available_weekends_id', name='Available_Weekdays_pkey')
    )

    available_weekends_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    weekday: Mapped[str] = mapped_column(Text, nullable=False)
    operator_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    operator: Mapped['Users'] = relationship('Users', back_populates='Available_Weekdays')
    Weekdays_: Mapped['Weekdays'] = relationship('Weekdays', back_populates='Available_Weekdays')


class Offers(Base):
    __tablename__ = 'Offers'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        CheckConstraint('client_rating >= 1 AND client_rating <= 5', name='Offers_client_rating_check'),
        CheckConstraint('operator_rating >= 1 AND operator_rating <= 5', name='Offers_operator_rating_check'),
        ForeignKeyConstraint(['client_id'], ['Users.user_id'], name='Offers_client_id_fkey'),
        ForeignKeyConstraint(['location_id'], ['Locations.location_id'], name='Offers_location_id_fkey'),
        ForeignKeyConstraint(['offer_type'], ['Offer_Types.name'], name='Offers_offer_type_fkey'),
        PrimaryKeyConstraint('offer_id', name='Offers_pkey')
    )

    offer_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    location_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    client_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    offer_type: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    deadline_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    match_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    format: Mapped[Optional[str]] = mapped_column(Text)
    flight_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    operator_rating: Mapped[Optional[int]] = mapped_column(SmallInteger)
    operator_review: Mapped[Optional[str]] = mapped_column(Text)
    client_rating: Mapped[Optional[int]] = mapped_column(SmallInteger)
    client_review: Mapped[Optional[str]] = mapped_column(Text)

    client: Mapped['Users'] = relationship('Users', back_populates='Offers')
    location: Mapped['Locations'] = relationship('Locations', back_populates='Offers')
    Offer_Types: Mapped['OfferTypes'] = relationship('OfferTypes', back_populates='Offers')
    Matches: Mapped[list['Matches']] = relationship('Matches', back_populates='offer')
    Offer_Parameters: Mapped[list['OfferParameters']] = relationship('OfferParameters', back_populates='offer')


class Matches(Base):
    __tablename__ = 'Matches'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        ForeignKeyConstraint(['offer_id'], ['Offers.offer_id'], name='Matches_offer_id_fkey'),
        ForeignKeyConstraint(['operator_id'], ['Users.user_id'], name='Matches_operator_id_fkey'),
        PrimaryKeyConstraint('match_id', name='Matches_pkey')
    )

    match_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    operator_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    offer_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    offer: Mapped['Offers'] = relationship('Offers', back_populates='Matches')
    operator: Mapped['Users'] = relationship('Users', back_populates='Matches')


class OfferParameters(Base):
    __tablename__ = 'Offer_Parameters'  # pyright: ignore[reportAssignmentType]
    __table_args__ = (
        ForeignKeyConstraint(['offer_id'], ['Offers.offer_id'], name='Offer_Parameters_offer_id_fkey'),
        ForeignKeyConstraint(['parameter_id'], ['Parameters.name'], name='Offer_Parameters_parameter_id_fkey'),
        PrimaryKeyConstraint('offer_parameters_id', name='Offer_Parameters_pkey')
    )

    offer_parameters_id: Mapped[int] = mapped_column(BigInteger, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    offer_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    parameter_id: Mapped[str] = mapped_column(Text, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)

    offer: Mapped['Offers'] = relationship('Offers', back_populates='Offer_Parameters')
    parameter: Mapped['Parameters'] = relationship('Parameters', back_populates='Offer_Parameters')
