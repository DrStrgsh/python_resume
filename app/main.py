from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.admin_projects import router as admin_projects_router
from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.core.config import get_settings

app = FastAPI(title="Resume API")
settings = get_settings()

@app.get("/health")
def health():
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(admin_projects_router)
