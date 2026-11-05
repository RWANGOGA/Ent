"""SQLAlchemy ORM models (the persistence schema).

These live only in infrastructure and never leak into the domain. List-valued
fields (courses, docs, duties) are stored as JSON so the schema stays portable
across Postgres and SQLite without association tables — keeping the project
minimal for now.
"""
from sqlalchemy import JSON, Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.db import Base


class OrganisationORM(Base):
    __tablename__ = "organisations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    sector: Mapped[str] = mapped_column(String, default="")
    loc: Mapped[str] = mapped_column(String, default="")
    seal: Mapped[str] = mapped_column(String, default="")
    about: Mapped[str] = mapped_column(Text, default="")


class PlacementORM(Base):
    __tablename__ = "placements"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    org_id: Mapped[str] = mapped_column(ForeignKey("organisations.id"), index=True)
    courses: Mapped[list] = mapped_column(JSON, default=list)
    grade: Mapped[str] = mapped_column(String, default="")
    loc: Mapped[str] = mapped_column(String, default="")
    mode: Mapped[str] = mapped_column(String, default="")
    duration: Mapped[str] = mapped_column(String, default="")
    stipend: Mapped[str] = mapped_column(String, default="")
    deadline: Mapped[str] = mapped_column(String, default="")
    slots: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String, default="Open")
    applicants: Mapped[int] = mapped_column(Integer, default=0)
    docs: Mapped[list] = mapped_column(JSON, default=list)
    testimonial: Mapped[bool] = mapped_column(Boolean, default=False)
    about: Mapped[str] = mapped_column(Text, default="")
    duties: Mapped[list] = mapped_column(JSON, default=list)
