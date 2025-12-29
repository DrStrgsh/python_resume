from app.db.session import SessionLocal
from app.models.users import User
from app.models.projects import Project


db = SessionLocal()

print("Console loaded:")
print(" - db")
print(" - Users")
print(" - Projects")