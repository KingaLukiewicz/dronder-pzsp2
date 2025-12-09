from dataclasses import dataclass

from sqlmodel import SQLModel


@dataclass
class Order(SQLModel, table=True):
    pass
