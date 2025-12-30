from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.api.deps import get_db
from app.models.users import User
from app.models.enums import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/auth/login")
INVALID_TOKEN = HTTPException(
    status_code = status.HTTP_401_UNAUTHORIZED,
    detail = "Invalid token",
    headers = {"WWW-Authenticate": "Bearer"}
)
ADMIN_ACCESS_REQUIRED = HTTPException(
    status_code = status.HTTP_403_FORBIDDEN,
    detail = "Admin access required"
)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms = [settings.JWT_ALGORITHM],
            options = {"require_sub": True, "require_exp": True}
        )
        sub = payload.get("sub")
        user_id = int(sub)
    except (JWTError, ValueError, TypeError, ExpiredSignatureError):
        raise INVALID_TOKEN

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