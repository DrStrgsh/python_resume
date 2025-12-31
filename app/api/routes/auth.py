from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.deps_auth import require_user
from app.core.config import get_settings
from app.core.security import create_access_token, verify_password
from app.models.users import User

router = APIRouter(prefix="/auth", tags=["auth"])

INVALID_CREDENTIALS = HTTPException(status_code=401, detail="Invalid credentials")
settings = get_settings()


@router.get("/me")
def me(user: User = Depends(require_user)):
    return {"id": user.id, "username": user.username, "role": user.role.value}


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise INVALID_CREDENTIALS

    if not verify_password(form_data.password, user.password_hash):
        raise INVALID_CREDENTIALS

    token = create_access_token(user_id=user.id, role=user.role)

    response.set_cookie(
        key=settings.ACCESS_TOKEN_COOKIE_NAME,
        value=token,
        httponly=settings.ACCESS_TOKEN_COOKIE_HTTPONLY,
        secure=settings.ACCESS_TOKEN_COOKIE_SECURE,
        samesite=settings.ACCESS_TOKEN_COOKIE_SAMESITE,
        path=settings.ACCESS_TOKEN_COOKIE_PATH,
    )

    return {"ok": True}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=settings.ACCESS_TOKEN_COOKIE_NAME, path=settings.ACCESS_TOKEN_COOKIE_PATH
    )

    return {"ok": True}
