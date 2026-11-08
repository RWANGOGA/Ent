"""Public Jobs Portal catalogue endpoints."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from app.infrastructure.repositories import SqlAlchemyJobRepository
from app.infrastructure.db import get_session
from app.presentation.schemas import JobListResponse, JobRead
from sqlalchemy.orm import Session

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListResponse)
def list_jobs(
    q: Optional[str] = None,
    location: Optional[str] = None,
    mode: Optional[str] = None,
    session: Session = Depends(get_session),
) -> JobListResponse:
    items = SqlAlchemyJobRepository(session).list(q=q, location=location, mode=mode)
    return JobListResponse(total=len(items), items=[JobRead.model_validate(item) for item in items])


@router.get("/{job_id}", response_model=JobRead)
def get_job(job_id: str, session: Session = Depends(get_session)) -> JobRead:
    job = SqlAlchemyJobRepository(session).get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobRead.model_validate(job)
