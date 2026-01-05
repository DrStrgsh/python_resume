from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.deps_auth import require_admin
from app.models.projects import Project
from app.models.users import User
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])

PROJECT_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
)

SLUG_EXISTS = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists"
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


@router.post("", response_model=ProjectOut)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing = db.query(Project).filter(Project.slug == payload.slug).first()
    if existing:
        raise SLUG_EXISTS

    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise PROJECT_NOT_FOUND

    if payload.slug is not None:
        other = (
            db.query(Project)
            .filter(Project.slug == payload.slug, Project.id != project_id)
            .first()
        )
        if other:
            raise SLUG_EXISTS

    update_data = payload.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(project, k, v)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise PROJECT_NOT_FOUND

    db.delete(project)
    db.commit()
    return {"message": "Deleted"}
