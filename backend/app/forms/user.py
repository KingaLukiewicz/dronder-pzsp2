from dataclasses import dataclass
from pydantic import BaseModel

from app.forms.offer import LocationForm
from app.forms.review import ReviewForm as Review


@dataclass
class UserdataForm(BaseModel):
  username: str | None = None
  description: str | None = None
  role: str | None = None
  location: LocationForm | None = None
  reviews: list[Review] | None = None