"""Application services — thin use-case orchestrators over the ports."""
from typing import Optional

from app.application.ports import PlacementRepository
from app.domain.entities import Placement


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
