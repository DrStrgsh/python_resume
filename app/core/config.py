import os
from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.getenv("ENV_FILE", ".env"), extra="ignore"
    )
    # extra="ignore" - якщо в .env є змінні, яких нема в класі Settings, то нічого НЕ падає

    DATABASE_URL: str | None = None
    POSTGRES_USERNAME: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str | None = None

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL

        if not all([self.POSTGRES_USERNAME, self.POSTGRES_PASSWORD, self.POSTGRES_DB]):
            raise RuntimeError("Invalid database configuration")

        return (
            f"postgresql://{self.POSTGRES_USERNAME}:"
            f"{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )

    JWT_SECRET_KEY: str = "secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "password"

    ACCESS_TOKEN_COOKIE_NAME: str = "access_token"
    ACCESS_TOKEN_COOKIE_HTTPONLY: bool = True
    ACCESS_TOKEN_COOKIE_SECURE: bool = False
    ACCESS_TOKEN_COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    ACCESS_TOKEN_COOKIE_PATH: str = "/"

    FRONTEND_ORIGINS: list[str] = ["http://localhost:3000"]

@lru_cache
def get_settings() -> Settings:
    return Settings()
