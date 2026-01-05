from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    url: str | None = None
    repo_url: str | None = None
    tags: str | None = None


# request
class ProjectCreate(ProjectBase):
    pass


# response
class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    repo_url: Optional[str] = None
    tags: Optional[str] = None
