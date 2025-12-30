import os

os.environ.setdefault("ENV_FILE", ".env.test")

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from alembic import command
from app.api.deps import get_db
from app.core.config import get_settings
from app.main import app
from tests.factories.loader import bind_sqlalchemy_session_to_all_factories


@pytest.fixture(scope="session")
def engine():
    settings = get_settings()
    engine = create_engine(settings.database_url, pool_pre_ping=True)
    return engine


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    yield
    command.downgrade(alembic_cfg, "base")  # чистимо БД


@pytest.fixture()
def db_session(engine):
    # сесія для тесту + ролбек після тесту. Для швидкості і ізоляції
    connection = engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=connection
    )
    session = TestingSessionLocal()
    bind_sqlalchemy_session_to_all_factories(session)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session):
    # get_db dependency перевизначаємо для FastAPI, щоб юзав нашу тест сесію
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
