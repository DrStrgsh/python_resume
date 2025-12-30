from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin

class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index = True)
    title: Mapped[str] = mapped_column(String(200), nullable = False)
    slug: Mapped[str] = mapped_column(String(200), unique = True, index = True, nullable = False)
    description: Mapped[str] = mapped_column(Text, nullable = False)
    url: Mapped[str] = mapped_column(String(500), nullable = True)
    repo_url: Mapped[str] = mapped_column(String(500), nullable = True)
    tags: Mapped[str] = mapped_column(String(500), nullable = True)