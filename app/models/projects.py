from sqlalchemy import Column, Integer, String, Text

from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String(500), nullable=True)
    repo_url = Column(String(500), nullable=True)
    tags = Column(String(500), nullable=True)