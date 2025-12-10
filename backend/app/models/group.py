from sqlmodel import Field, Relationship, SQLModel 
from dataclasses import dataclass

@dataclass
class Group(SQLModel, table=True):
    __tablename__: str = 'Groups'  # pyright: ignore[reportIncompatibleVariableOverride]
    group_id: int | None = Field(default=None, primary_key=True)
    operator: bool = Field(nullable=False)
    client: bool = Field(nullable=False)
    admin: bool = Field(nullable=False)