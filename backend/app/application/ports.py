"""Ports (interfaces) the application layer depends on.

High-level use cases depend on these abstractions, never on concrete adapters.
Postgres/SQLite repositories and, later, the Groq client implement them — that
is what keeps the domain swappable and the tests offline (SOLID: DIP + ISP).
"""
from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities import Placement


class PlacementRepository(ABC):
    """Read access to the placements catalogue."""

    @abstractmethod
    def list(
        self,
        *,
        q: Optional[str] = None,
        org_type: Optional[str] = None,
        location: Optional[str] = None,
        mode: Optional[str] = None,
    ) -> list[Placement]:
        """Return placements, optionally filtered by keyword / employer type /
        location / work mode."""

    @abstractmethod
    def get(self, placement_id: str) -> Optional[Placement]:
        """Return a single placement by id, or None."""
