from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Self
from pydantic import BaseModel, field_validator, model_validator


@dataclass
class LocationForm(BaseModel):
    address: str | None = None
    geo_longitude: Decimal | None = None
    geo_latitude: Decimal | None = None
    radius: int | None = None

    @model_validator(mode="after")
    def address_or_coords_present(self) -> Self:
        if self.address is not None or (
            self.geo_latitude is not None
            and self.geo_longitude is not None
            and self.radius is not None
        ):
            return self
        raise ValueError(
            "Location incomplete - provide either address or all of longitude and latitude and radius"
        )


@dataclass
class ParameterForm(BaseModel):
    name: str
    value: str


@dataclass
class OfferForm(BaseModel):
    description: str
    offer_type: str
    deadline_date: date
    location: LocationForm
    offer_id: int | None = None
    client_id: int | None = None
    client_name: str | None = None
    flight_date: date | None = None
    location_id: int | None = None
    format: str | None = None
    parameters: list[ParameterForm] | None = None
    status: str = "new"

    operator_id: int | None = None
    operator_name: str | None = None

    @field_validator("deadline_date", "flight_date", mode="before")
    @classmethod
    def parse_http_date(cls, v: Any):
        if isinstance(v, str):
            return datetime.strptime(v, "%a, %d %b %Y %H:%M:%S GMT").date()
        return v
