from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.enums import UserRole

pwd_context = CryptContext(schemes = ["argon2"], deprecated = "auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(user_id: int, role: UserRole) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "role": role.value,
        "iat": int(now.timestamp()), # коли видано
        "exp": int(expire.timestamp()) # коли експайриться
    }

    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm = settings.JWT_ALGORITHM)