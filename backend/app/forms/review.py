from dataclasses import dataclass
from typing import Self
from pydantic import BaseModel, Field, model_validator


@dataclass
class ReviewForm(BaseModel):
    offer_id: int | None = None
    review_date: str | None = None
    rating: int | None = Field(None, ge=1, le=5)
    review: str | None = None
    reviewer: str | None = None

    @model_validator(mode="after")
    def has_anything(self) -> Self:
        if self.rating is None and self.review is None:
            raise ValueError("Provide rating or review")
        return self
