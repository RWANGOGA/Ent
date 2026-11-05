"""Test harness.

Pins the environment to an in-memory SQLite database *before* the app is
imported, so the very same code path (engine → repository → service → router)
that runs on Postgres in production runs here — just against a different, fast,
Docker-free adapter. This is the payoff of depending on a port, not a concrete
database.
"""
import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ENVIRONMENT"] = "test"

import pytest
from fastapi.testclient import TestClient

from app.infrastructure.db import Base, SessionLocal, engine
from app.infrastructure.seed import seed_if_empty
from app.presentation.main import create_app


@pytest.fixture(scope="session")
def _prepared_db():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_if_empty(session)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def session(_prepared_db):
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


@pytest.fixture
def client(_prepared_db):
    app = create_app()
    with TestClient(app) as c:
        yield c
