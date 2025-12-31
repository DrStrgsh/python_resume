from fastapi import Cookie, Depends, HTTPException, status
from jose import ExpiredSignatureError, JWTError, jwt
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import get_settings
from app.models.enums import UserRole
from app.models.users import User

INVALID_TOKEN = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
)
ADMIN_ACCESS_REQUIRED = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
)
settings = get_settings()


def get_access_token(
    access_token_cookie: str | None = Cookie(
        default=None, alias=settings.ACCESS_TOKEN_COOKIE_NAME
    ),
) -> str:
    if access_token_cookie:
        return access_token_cookie

    raise INVALID_TOKEN


def get_current_user(
    token: str = Depends(get_access_token), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"require_sub": True, "require_exp": True},
        )
        sub = payload.get("sub")
        user_id = int(sub)
    except (JWTError, ValueError, TypeError, ExpiredSignatureError) as err:
        raise INVALID_TOKEN from err

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise INVALID_TOKEN

    return user


def require_user(user: User = Depends(get_current_user)) -> User:
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.admin:
        raise ADMIN_ACCESS_REQUIRED
    return user
