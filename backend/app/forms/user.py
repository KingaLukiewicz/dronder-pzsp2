from enum import Enum
from dataclasses import dataclass
from typing import Annotated, Dict
from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumberValidator

from app.forms.offer import LocationForm
from app.forms.review import ReviewForm as Review


@dataclass
class UserdataForm(BaseModel):
    username: str | None = None
    description: str | None = None
    role: str | None = None
    location: LocationForm | None = None
    phone_number: Annotated[str, PhoneNumberValidator(default_region="PL")] | None = (
        None
    )
    email: EmailStr | None = None
    reviews: list[Review] | None = None
    products: list[str] = []
    user_id: int | None = None


class WeekdayEnum(str, Enum):
    Poniedziałek = "Poniedziałek"
    Wtorek = "Wtorek"
    Środa = "Środa"
    Czwartek = "Czwartek"
    Piątek = "Piątek"
    Sobota = "Sobota"
    Niedziela = "Niedziela"


@dataclass
class WeekdaysForm(BaseModel):
    weekdays: Dict[WeekdayEnum, bool] = Field(default_factory=dict)
