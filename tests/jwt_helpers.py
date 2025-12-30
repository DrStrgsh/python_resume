from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core.config import get_settings
from app.models.users import User


def make_token(
    *, sub: int, role: str, secret: str | None = None, exp_delta_seconds: int = 3600
) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=exp_delta_seconds)
    payload = {
        "sub": str(sub),
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    return jwt.encode(
        payload, secret or settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def token_for(user: User):
    token = make_token(sub=user.id, role=user.role)

    return token
