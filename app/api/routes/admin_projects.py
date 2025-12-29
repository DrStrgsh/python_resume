from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.deps_auth import require_admin
from app.models.users import User
from app.models.projects import Project
from app.schemas.project import ProjectCreate, ProjectOut


router = APIRouter(prefix="/admin/projects", tags=["admin"])

@router.post("", response_model=ProjectOut)
def create_project(
        payload: ProjectCreate,
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    existing = db.query(Project).filter(Project.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
        project_id: int,
        payload: ProjectCreate,
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    other = db.query(Project).filter(Project.slug == payload.slug, Project.id != project_id).first()
    if other:
        raise HTTPException(status_code=400, detail="Slug already exists")

    for k, v in payload.model_dump().items():
        setattr(project, k, v)

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
        project_id: int,
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Deleted"}