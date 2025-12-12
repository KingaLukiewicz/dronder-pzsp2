from typing import LiteralString
from pydantic import ValidationError
import pydantic_core


def create_validation_error(
    obj: object, error_type: LiteralString, reason: LiteralString, location: str
) -> ValidationError:
    error = pydantic_core.InitErrorDetails(
        type=pydantic_core.PydanticCustomError(
            error_type,
            reason,
            {"reason": reason},
        ),
        loc=(location,),
        input=obj,
        ctx={"reason": reason},
    )
    return ValidationError.from_exception_data(obj.__class__.__name__, [error])
