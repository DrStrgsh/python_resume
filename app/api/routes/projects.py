from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.projects import Project
from app.schemas.project import ProjectOut

router = APIRouter(prefix="/projects", tags=["projects"])

PROJECT_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
)


@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.id.desc()).all()


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()

    if not project:
        raise PROJECT_NOT_FOUND

    return project
