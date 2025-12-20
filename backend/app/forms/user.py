from dataclasses import dataclass
from pydantic import BaseModel, Field

from app.forms.offer import LocationForm

@dataclass
class Review(BaseModel):
  review_id: int | None = None
  reviewer: str
  rating: int | None = Field(None, ge=1, le=5)
  review: str | None = None

@dataclass
class UserdataForm(BaseModel):
  username: str | None = None
  description: str | None = None
  role: str | None = None
  location: LocationForm | None = None
  reviews: list[Review] | None = None