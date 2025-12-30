from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.deps_auth import require_user
from app.core.security import create_access_token, verify_password
from app.models.users import User
from app.schemas.auth import TokenOut

router = APIRouter(prefix="/auth", tags=["auth"])

INVALID_CREDENTIALS = HTTPException(status_code=401, detail="Invalid credentials")


@router.get("/me")
def me(user: User = Depends(require_user)):
    return {"id": user.id, "username": user.username, "role": user.role.value}


@router.post("/login", response_model=TokenOut)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise INVALID_CREDENTIALS

    if not verify_password(form_data.password, user.password_hash):
        raise INVALID_CREDENTIALS

    token = create_access_token(user_id=user.id, role=user.role)
    return {"access_token": token, "token_type": "bearer"}
