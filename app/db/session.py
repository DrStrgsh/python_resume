from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


# точка входу до БД
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
# pool_pre_ping робить пропінговку SELECT 1 перед кожним запитом до БД, аля перевірка чи конект з базою не здох. Якщо здох, то переконекчується.

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
# bind=engine - привязка до engine
# autocommit=False - не комітить автоматом
# autoflush=False - не писати в БД до commit()