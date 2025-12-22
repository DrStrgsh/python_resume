from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    # extra="ignore" - якщо в .env є змінні, яких нема в класі Settings, то нічого НЕ падає

    DATABASE_URL: str = "postgresql://strgsh:password@localhost:5432/resume_db"
    # справа дефолт для DATABASE_URL на випадок, якщо не вказати змінну в .env

settings = Settings()