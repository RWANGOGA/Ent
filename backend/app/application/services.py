"""Application services — thin use-case orchestrators over the ports."""
from typing import Optional

from app.application.ports import PlacementRepository
from app.domain.entities import Placement
from app.domain.matching import RankedPlacement, match_placement


class PlacementService:
    """Use cases for browsing the placements catalogue.

    Depends only on the ``PlacementRepository`` port, so the same service runs
    against Postgres in production and SQLite in tests.
    """

    def __init__(self, repo: PlacementRepository) -> None:
        self._repo = repo

    def list_placements(
        self,
        *,
        q: Optional[str] = None,
        org_type: Optional[str] = None,
        location: Optional[str] = None,
        mode: Optional[str] = None,
    ) -> list[Placement]:
        return self._repo.list(q=q, org_type=org_type, location=location, mode=mode)

    def get_placement(self, placement_id: str) -> Optional[Placement]:
        return self._repo.get(placement_id)


class MatchingService:
    """Use case: rank placements against a student's skill profile.

    Pulls the candidate pool through the same ``PlacementRepository`` port and
    delegates the actual scoring to the pure domain matcher. Keeping the repo
    behind the port means this use case is testable offline and DB-agnostic.
    """

    def __init__(self, repo: PlacementRepository) -> None:
        self._repo = repo

    def rank(
        self,
        *,
        student_skills: list[str],
        student_course: str,
        student_cgpa: float,
        q: Optional[str] = None,
        org_type: Optional[str] = None,
        location: Optional[str] = None,
        mode: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> list[RankedPlacement]:
        candidates = self._repo.list(
            q=q, org_type=org_type, location=location, mode=mode
        )
        ranked = [
            RankedPlacement(
                placement=p,
                match=match_placement(p, student_skills, student_course, student_cgpa),
            )
            for p in candidates
        ]
        ranked.sort(key=lambda r: (-r.match.score, r.placement.id))
        return ranked[:limit] if limit else ranked
