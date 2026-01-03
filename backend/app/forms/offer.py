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
        if self.address is None and (
            self.geo_latitude is None
            or self.geo_longitude is None
            or self.radius is None
        ):
            raise ValueError(
                "Location incomplete - provide either address or all of longitude and latitude and radius"
            )
        return self


@dataclass
class ParameterForm(BaseModel):
    name: str
    value: str


@dataclass
class OfferForm(BaseModel):
    offer_id: int | None = None
    description: str
    client_id: int | None = None
    client_name: str | None = None
    offer_type: str
    flight_date: date | None = None
    deadline_date: date
    location: LocationForm
    location_id: int | None = None
    format: str | None = None
    parameters: list[ParameterForm] | None = None
    status: str = "new"

    @field_validator("deadline_date", mode="before")
    @classmethod
    def parse_http_date(cls, v: Any):
        if isinstance(v, str):
            return datetime.strptime(v, "%a, %d %b %Y %H:%M:%S GMT").date()
        return v
