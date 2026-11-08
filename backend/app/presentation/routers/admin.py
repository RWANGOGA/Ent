"""Platform administrator internship review workflow."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domain.entities import User
from app.infrastructure.db import get_session
from app.infrastructure.orm import PlacementORM
from app.infrastructure.repositories import SqlAlchemyPlacementRepository
from app.presentation.deps import get_current_user
from app.presentation.schemas import (
    InternshipReviewListResponse,
    InternshipReviewRequest,
    InternshipPostingRead,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only platform administrators can review internships")


@router.get("/internships/review", response_model=InternshipReviewListResponse)
def list_internship_review_queue(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> InternshipReviewListResponse:
    _require_admin(current_user)
    rows = (
        session.query(PlacementORM)
        .filter(PlacementORM.review_status == "pending_review")
        .order_by(PlacementORM.published_at, PlacementORM.id)
        .all()
    )
    repo = SqlAlchemyPlacementRepository(session)
    items = [repo.get(row.id) for row in rows]
    resolved = [item for item in items if item is not None]
    return InternshipReviewListResponse(
        total=len(resolved),
        items=[InternshipPostingRead.model_validate(item) for item in resolved],
    )


@router.patch("/internships/{internship_id}/review", response_model=InternshipPostingRead)
def review_internship(
    internship_id: str,
    payload: InternshipReviewRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> InternshipPostingRead:
    _require_admin(current_user)
    decision = payload.decision.strip().lower()
    if decision not in ("approved", "rejected"):
        raise HTTPException(status_code=422, detail="Decision must be approved or rejected")
    if decision == "rejected" and not payload.reason.strip():
        raise HTTPException(status_code=422, detail="A rejection reason is required")
    row = session.get(PlacementORM, internship_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Internship not found")
    if row.review_status != "pending_review":
        raise HTTPException(status_code=409, detail="Internship is not awaiting review")
    row.review_status = decision
    row.review_reason = payload.reason.strip() if decision == "rejected" else ""
    if decision == "approved":
        row.status = "Open"
        row.published_at = row.published_at or date.today().isoformat()
    else:
        row.status = "Closed"
    session.commit()
    placement = SqlAlchemyPlacementRepository(session).get(internship_id)
    if placement is None:
        raise HTTPException(status_code=500, detail="Reviewed internship could not be loaded")
    return InternshipPostingRead.model_validate(placement)
