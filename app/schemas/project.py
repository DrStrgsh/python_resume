from pydantic import BaseModel


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

    class Config:
        # дає читати SQLAlchemy об'єкти і конвертити в JSON
        from_attributes = True