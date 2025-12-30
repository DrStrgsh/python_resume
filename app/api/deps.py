from collections.abc import Generator
from sqlalchemy.orm import Session

from app.db.session import SessionLocal

# відкриваємо сесію, даємо її в ендпоінт -> закриваємо сесію
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()