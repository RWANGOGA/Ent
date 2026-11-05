"""Ports (interfaces) the application layer depends on.

High-level use cases depend on these abstractions, never on concrete adapters.
Postgres/SQLite repositories and, later, the Groq client implement them — that
is what keeps the domain swappable and the tests offline (SOLID: DIP + ISP).
"""
from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities import Application, Placement, Subscription


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


class LLMClient(ABC):
    """Port for the language model behind the career advisor.

    The advisor depends on this abstraction, so production can talk to Groq
    while tests inject a deterministic fake — no network, no API key, fully
    offline. (SOLID: DIP.)
    """

    @abstractmethod
    def complete(self, prompt: str) -> str:
        """Return the model's answer to a single prompt."""


class SavedRepository(ABC):
    """A user's bookmarked placements."""

    @abstractmethod
    def list(self, user_id: str) -> list[str]:
        """Placement ids the user has saved (deterministic order)."""

    @abstractmethod
    def is_saved(self, user_id: str, placement_id: str) -> bool: ...

    @abstractmethod
    def toggle(self, user_id: str, placement_id: str) -> bool:
        """Add if absent, remove if present. Return the new saved state."""


class ApplicationRepository(ABC):
    """Submissions students make to placements."""

    @abstractmethod
    def add(self, application: Application) -> Application: ...

    @abstractmethod
    def find(self, user_id: str, placement_id: str) -> Optional[Application]: ...

    @abstractmethod
    def list_for_user(self, user_id: str) -> list[Application]: ...

    @abstractmethod
    def list_for_placement(self, placement_id: str) -> list[Application]: ...


class SubscriptionRepository(ABC):
    """Host organisations' billing state."""

    @abstractmethod
    def get(self, org_id: str) -> Subscription:
        """Return the org's subscription, or a Free default if none exists."""

    @abstractmethod
    def save(self, subscription: Subscription) -> Subscription: ...


