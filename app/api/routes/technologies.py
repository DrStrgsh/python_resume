from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.deps_auth import require_admin
from app.models.technologies import Technology
from app.models.users import User
from app.schemas.technology import TechnologyCreate, TechnologyOut

router = APIRouter(prefix="/technologies", tags=["technologies"])

TECHNOLOGY_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Technology not found"
)

TECHNOLOGY_EXISTS = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, detail="Technology already exists"
)


@router.get("", response_model=list[TechnologyOut])
def list_technologies(db: Session = Depends(get_db)):
    return db.query(Technology).order_by(Technology.start_year.asc()).all()


@router.post("", response_model=TechnologyOut)
def create_technology(
    payload: TechnologyCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing = db.query(Technology).filter(Technology.name == payload.name).first()
    if existing:
        raise TECHNOLOGY_EXISTS

    technology = Technology(**payload.model_dump())
    db.add(technology)
    db.commit()
    db.refresh(technology)
    return technology


@router.put("/{technology_id}", response_model=TechnologyOut)
def update_technology(
    technology_id: int,
    payload: TechnologyCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    technology = db.query(Technology).filter(Technology.id == technology_id).first()
    if not technology:
        raise TECHNOLOGY_NOT_FOUND

    other = (
        db.query(Technology)
        .filter(Technology.name == payload.name, Technology.id != technology_id)
        .first()
    )
    if other:
        raise TECHNOLOGY_EXISTS

    for k, v in payload.model_dump().items():
        setattr(technology, k, v)

    db.commit()
    db.refresh(technology)
    return technology


@router.delete("/{technology_id}")
def delete_technology(
    technology_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    technology = db.query(Technology).filter(Technology.id == technology_id).first()
    if not technology:
        raise TECHNOLOGY_NOT_FOUND

    db.delete(technology)
    db.commit()
    return {"message": "Deleted"}
