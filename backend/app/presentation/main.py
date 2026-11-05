"""Application factory and composition root.

This is the only module that knows about every layer at once: it builds tables,
seeds the catalogue and mounts routers. Everything else depends inward on
abstractions, so this file is where the object graph is assembled.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.infrastructure.db import Base, SessionLocal, engine
from app.infrastructure.orm import OrganisationORM, PlacementORM  # noqa: F401 (register tables)
from app.infrastructure.seed import seed_if_empty
from app.presentation.routers import placements


def _init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_if_empty(session)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dev/test convenience: ensure tables + seed exist on boot. When the schema
    # starts evolving, replace this with Alembic migrations.
    _init_db()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["system"])
    def health() -> dict:
        return {"status": "ok", "service": settings.app_name, "environment": settings.environment}

    app.include_router(placements.router)
    return app


app = create_app()
