from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.core.config import get_settings
from app.models.users import User

settings = get_settings()


def make_token(
    *, sub: int, role: str, secret: str | None = None, exp_delta_seconds: int = 3600
) -> str:
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
    return make_token(sub=user.id, role=user.role)


def authenticate_client(client: Any, user: User, token: str | None = None) -> None:
    if not token:
        token = token_for(user)

    client.cookies.set(settings.ACCESS_TOKEN_COOKIE_NAME, token)
