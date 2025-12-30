from pydantic import BaseModel, ConfigDict
from datetime import datetime

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

    model_config = ConfigDict(from_attributes = True)