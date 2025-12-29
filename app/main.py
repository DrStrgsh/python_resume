from fastapi import FastAPI

from app.api.routes.projects import router as projects_router
from app.api.routes.auth import router as auth_router
from app.api.routes.admin_projects import router as admin_projects_router

app = FastAPI(title="Resume API")

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(admin_projects_router)