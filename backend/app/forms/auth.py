from typing import Annotated, Self
from pydantic import BaseModel, EmailStr, StringConstraints, model_validator
from pydantic_extra_types.phone_numbers import PhoneNumberValidator

from app.utils.errors import create_validation_error


class RegisterForm(BaseModel):
    username: Annotated[str, StringConstraints(strip_whitespace=True)]
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=9)]
    re_password: Annotated[str, StringConstraints(min_length=9)]
    phone_number: Annotated[str, PhoneNumberValidator()]
    role: str = 'user'

    @model_validator(mode="after")
    def validate_same_password(self) -> Self:
        if self.password != self.re_password:
            raise create_validation_error(
                self, "value_error", "Passwords do not match", "re_password"
            )
        return self


class LoginForm(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=9)]
