from sqlalchemy.orm import declarative_base

# свторюємо батю для всіх моделей
Base = declarative_base()
# тепер SQLAlchemy знає які table існують і як їх створювати