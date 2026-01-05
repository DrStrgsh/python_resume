from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TechnologyBase(BaseModel):
    name: str
    start_year: int


class TechnologyCreate(TechnologyBase):
    pass


class TechnologyOut(TechnologyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
