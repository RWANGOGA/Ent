"""Database engine and session.

One engine is built from settings at import time (connection creation is lazy,
so importing this module does not open a socket). SQLite in-memory uses a
StaticPool so the single connection — and its data — survives across sessions,
which is what lets the test harness reuse an in-memory database.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def _build_engine(url: str):
    if url.startswith("sqlite"):
        kwargs = {"connect_args": {"check_same_thread": False}}
        if ":memory:" in url:
            kwargs["poolclass"] = StaticPool
        return create_engine(url, **kwargs)
    return create_engine(url, pool_pre_ping=True)


engine = _build_engine(get_settings().database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_session():
    """FastAPI dependency yielding a per-request session."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
