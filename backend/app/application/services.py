"""Application services — thin use-case orchestrators over the ports."""
from datetime import date
from typing import Optional
from uuid import uuid4

from app.application.ports import (
    ApplicationRepository,
    PlacementRepository,
    SavedRepository,
    SubscriptionRepository,
)
from app.core.errors import PlacementNotFound, PlacementNotOpen
from app.domain.entities import Application, Placement, Subscription
from app.domain.matching import (
    GRADE_RANK,
    REQUIRED_SKILLS,
    SKILLS,
    RankedPlacement,
    match_placement,
)


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

    def catalog_meta(self) -> dict:
        """Catalogue metadata the UI needs to render filters and explain matches.

        Courses/types/locations are derived from the placements actually stored
        in the database — they can never drift from the catalog. The grade
        thresholds, skill taxonomy and per-placement requirements come from the
        matching domain, which is their single source of truth; the frontend
        keeps no private copies of these tables.
        """
        placements = self._repo.list()
        courses = sorted({c for p in placements for c in p.courses})
        org_types = sorted({p.org.type for p in placements if p.org and p.org.type})
        locations = sorted({p.loc for p in placements if p.loc})
        return {
            "courses": courses,
            "org_types": org_types,
            "locations": locations,
            "grade_rules": dict(GRADE_RANK),
            "required_skills": dict(REQUIRED_SKILLS),
            "skills": [
                {"name": s.name, "category": s.category, "keywords": list(s.keywords)}
                for s in SKILLS
            ],
        }


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


class SavedService:
    """Use cases for a user's bookmarked placements."""

    def __init__(self, repo: SavedRepository) -> None:
        self._repo = repo

    def list(self, user_id: str) -> list[str]:
        return self._repo.list(user_id)

    def is_saved(self, user_id: str, placement_id: str) -> bool:
        return self._repo.is_saved(user_id, placement_id)

    def toggle(self, user_id: str, placement_id: str) -> "tuple[bool, list[str]]":
        now_saved = self._repo.toggle(user_id, placement_id)
        return now_saved, self._repo.list(user_id)


class ApplicationService:
    """Use cases for applying to placements.

    Holds the two real business rules: you can only apply to an existing, open
    placement, and applying twice for the same placement is idempotent.
    """

    def __init__(self, placements: PlacementRepository, apps: ApplicationRepository) -> None:
        self._placements = placements
        self._apps = apps

    def apply(self, *, user_id: str, placement_id: str, statement: str = "") -> Application:
        placement = self._placements.get(placement_id)
        if placement is None:
            raise PlacementNotFound(placement_id)
        if placement.status == "Closed":
            raise PlacementNotOpen(placement_id)

        existing = self._apps.find(user_id, placement_id)
        if existing is not None:
            return existing  # idempotent: no duplicate applications

        application = Application(
            id=uuid4().hex,
            user_id=user_id,
            placement_id=placement_id,
            status="Submitted",
            statement=statement,
            created_at=date.today().isoformat(),
        )
        return self._apps.add(application)

    def list_for_user(self, user_id: str) -> list[Application]:
        return self._apps.list_for_user(user_id)

    def list_for_placement(self, placement_id: str) -> list[Application]:
        return self._apps.list_for_placement(placement_id)


class BillingService:
    """Use cases for the host organisation's placement-fee plan."""

    def __init__(self, repo: SubscriptionRepository) -> None:
        self._repo = repo

    def get(self, org_id: str) -> Subscription:
        return self._repo.get(org_id)

    def activate(
        self, org_id: str, plan: str, billing: str, seats: int
    ) -> Subscription:
        return self._repo.save(
            Subscription(
                org_id=org_id,
                plan=plan,
                billing=billing,
                seats=max(1, seats),
                since=date.today().isoformat(),
            )
        )

    def cancel(self, org_id: str) -> Subscription:
        return self._repo.save(
            Subscription(org_id=org_id, plan="Free", billing="", seats=1, since="")
        )
