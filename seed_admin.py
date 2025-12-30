from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.enums import UserRole
from app.models.users import User

db = SessionLocal()
settings = get_settings()
username = settings.ADMIN_USERNAME
password = settings.ADMIN_PASSWORD

exists = db.query(User).filter(User.username == username).first()
try:
    if not exists:
        admin = User(
            username=username,
            password_hash=hash_password(password),
            role=UserRole.admin,
        )
        db.add(admin)
        db.commit()
        print("Admin created")
    else:
        print("Admin already exists")
except Exception:
    db.rollback()
    raise
finally:
    db.close()
