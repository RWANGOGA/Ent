"""SQLAlchemy ORM models (the persistence schema).

These live only in infrastructure and never leak into the domain. List-valued
fields (courses, docs, duties) are stored as JSON so the schema stays portable
across Postgres and SQLite without association tables — keeping the project
minimal for now.
"""
from sqlalchemy import JSON, Boolean, ForeignKey, Integer, String, Text
from sqlalchemy import LargeBinary
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
    review_status: Mapped[str] = mapped_column(String, default="approved")
    published_at: Mapped[str] = mapped_column(String, default="")
    closes_at: Mapped[str] = mapped_column(String, default="")
    starts_at: Mapped[str] = mapped_column(String, default="")
    requirements: Mapped[list] = mapped_column(JSON, default=list)
    review_reason: Mapped[str] = mapped_column(Text, default="")


class SavedORM(Base):
    __tablename__ = "saved_placements"

    user_id: Mapped[str] = mapped_column(String, primary_key=True)
    placement_id: Mapped[str] = mapped_column(String, primary_key=True)


class ApplicationORM(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    placement_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String, default="Submitted")
    statement: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[str] = mapped_column(String, default="")


class StudentProfileORM(Base):
    __tablename__ = "student_profiles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    course: Mapped[str] = mapped_column(String, default="")
    year: Mapped[str] = mapped_column(String, default="")
    cgpa: Mapped[float] = mapped_column(default=0.0)
    university: Mapped[str] = mapped_column(String, default="")
    skills: Mapped[list] = mapped_column(JSON, default=list)


class ResumeORM(Base):
    __tablename__ = "resumes"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[str] = mapped_column(String, default="application/octet-stream")
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    content: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    uploaded_at: Mapped[str] = mapped_column(String, default="")


class StudentDocumentORM(Base):
    __tablename__ = "student_documents"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    document_type: Mapped[str] = mapped_column(String, index=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[str] = mapped_column(String, default="application/octet-stream")
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    content: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")
    rejection_reason: Mapped[str] = mapped_column(Text, default="")
    uploaded_at: Mapped[str] = mapped_column(String, default="")


class SubscriptionORM(Base):
    __tablename__ = "subscriptions"

    org_id: Mapped[str] = mapped_column(String, primary_key=True)
    plan: Mapped[str] = mapped_column(String, default="Free")
    billing: Mapped[str] = mapped_column(String, default="")
    seats: Mapped[int] = mapped_column(Integer, default=1)
    since: Mapped[str] = mapped_column(String, default="")


class UserORM(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String, default="")
    role: Mapped[str] = mapped_column(String, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[str] = mapped_column(String, default="")
    # Employer accounts act on their organisation; derived from the token in
    # the user-state endpoints. Nullable: students/jobseekers/admins have none.
    org_id: Mapped[str | None] = mapped_column(String, nullable=True)
