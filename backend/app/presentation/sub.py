"""Sub-application that owns the domain-feature routers.

`main.py` mounts this under ``/api``. Keeping it a separate FastAPI instance
means the user's instinct holds: `main.py` stays a tiny composition root (system
endpoints + mounting), while feature routes live in their own mounted app
instead of piling onto one growing file. It also boots standalone for local dev
with its own tables + seed.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.db import Base, SessionLocal, engine
from app.infrastructure.orm import OrganisationORM, PlacementORM  # noqa: F401 (register tables)
from app.infrastructure.seed import seed_if_empty
from app.presentation.routers import (
    advisor,
    matching,
    placements,
    user_state,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Standalone dev convenience. When mounted, the parent app owns lifespan,
    # so this only runs if you serve this sub-app directly.
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_if_empty(session)
    yield


def create_sub_app() -> FastAPI:
    sub = FastAPI(
        title="Intern API — features", version="0.1.0", lifespan=lifespan
    )
    sub.add_middleware(
        CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
    )
    sub.include_router(placements.router)
    sub.include_router(matching.router)
    sub.include_router(advisor.router)
    sub.include_router(user_state.router)
    return sub


subapp = create_sub_app()
