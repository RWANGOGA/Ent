"""Database engine and session.

One engine is built from settings at import time (connection creation is lazy,
so importing this module does not open a socket). SQLite in-memory uses a
StaticPool so the single connection — and its data — survives across sessions,
which is what lets the test harness reuse an in-memory database.
"""
from sqlalchemy import create_engine, inspect, text
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


def ensure_schema() -> None:
    """Idempotent, additive column migrations for already-created tables.

    ``Base.metadata.create_all`` only creates missing tables — it never alters
    an existing one, so a column added to the ORM after a database already
    exists (here: ``users.org_id`` for the R1d token-derived identity) would
    otherwise be absent and every users query would fail. We check the actual
    schema and add just the missing column. Fresh SQLite test databases get the
    column from create_all, so this is a no-op there; only long-lived Postgres
    (Neon) is patched.
    """
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return
    existing = {c["name"] for c in inspector.get_columns("users")}
    statements = []
    if "org_id" not in existing:
        statements.append("ALTER TABLE users ADD COLUMN org_id VARCHAR")
    if "placements" in inspector.get_table_names():
        placement_columns = {
            c["name"] for c in inspector.get_columns("placements")
        }
        additions = {
            "review_status": "VARCHAR DEFAULT 'approved'",
            "published_at": "VARCHAR DEFAULT ''",
            "closes_at": "VARCHAR DEFAULT ''",
            "starts_at": "VARCHAR DEFAULT ''",
            "requirements": "JSON",
            "review_reason": "TEXT DEFAULT ''",
        }
        statements.extend(
            f"ALTER TABLE placements ADD COLUMN {name} {definition}"
            for name, definition in additions.items()
            if name not in placement_columns
        )
    if "jobs" in inspector.get_table_names():
        job_columns = {c["name"] for c in inspector.get_columns("jobs")}
        job_additions = {
            "review_status": "VARCHAR DEFAULT 'approved'",
            "published_at": "VARCHAR DEFAULT ''",
            "review_reason": "TEXT DEFAULT ''",
        }
        statements.extend(
            f"ALTER TABLE jobs ADD COLUMN {name} {definition}"
            for name, definition in job_additions.items()
            if name not in job_columns
        )
    if statements:
        with engine.begin() as conn:
            for statement in statements:
                conn.execute(text(statement))
