from fastapi import FastAPI

from app.api.routes.projects import router as projects_router


app = FastAPI(title="Resume API")

@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(projects_router)