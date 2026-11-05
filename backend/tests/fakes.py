"""Test doubles. A deterministic LLMClient so advisor tests never hit Groq."""
from collections import defaultdict
from typing import Optional

from app.application.ports import (
    ApplicationRepository,
    LLMClient,
    PlacementRepository,
    SavedRepository,
    SubscriptionRepository,
    UserRepository,
)
from app.domain.entities import Application, Placement, Subscription, User


class FakeLLM(LLMClient):
    def __init__(self, canned: str = "Here is your advice.") -> None:
        self.canned = canned
        self.last_prompt: str | None = None
        self.calls = 0

    def complete(self, prompt: str) -> str:
        self.last_prompt = prompt
        self.calls += 1
        return self.canned


class InMemoryPlacementRepository(PlacementRepository):
    def __init__(self, placements: list[Placement]) -> None:
        self._by_id = {p.id: p for p in placements}

    def list(self, **filters) -> list[Placement]:
        return list(self._by_id.values())

    def get(self, placement_id: str) -> Optional[Placement]:
        return self._by_id.get(placement_id)


class InMemoryApplicationRepository(ApplicationRepository):
    def __init__(self) -> None:
        self._items: list[Application] = []

    def add(self, application: Application) -> Application:
        self._items.append(application)
        return application

    def find(self, user_id: str, placement_id: str) -> Optional[Application]:
        return next(
            (
                a
                for a in self._items
                if a.user_id == user_id and a.placement_id == placement_id
            ),
            None,
        )

    def list_for_user(self, user_id: str) -> list[Application]:
        return [a for a in self._items if a.user_id == user_id]

    def list_for_placement(self, placement_id: str) -> list[Application]:
        return [a for a in self._items if a.placement_id == placement_id]


class InMemorySavedRepository(SavedRepository):
    def __init__(self) -> None:
        self._by_user: dict[str, set[str]] = defaultdict(set)

    def list(self, user_id: str) -> list[str]:
        return sorted(self._by_user[user_id])

    def is_saved(self, user_id: str, placement_id: str) -> bool:
        return placement_id in self._by_user[user_id]

    def toggle(self, user_id: str, placement_id: str) -> bool:
        if placement_id in self._by_user[user_id]:
            self._by_user[user_id].discard(placement_id)
            return False
        self._by_user[user_id].add(placement_id)
        return True


class InMemorySubscriptionRepository(SubscriptionRepository):
    def __init__(self) -> None:
        self._by_org: dict[str, Subscription] = {}

    def get(self, org_id: str) -> Subscription:
        return self._by_org.get(org_id, Subscription(org_id=org_id))

    def save(self, subscription: Subscription) -> Subscription:
        self._by_org[subscription.org_id] = subscription
        return subscription


class InMemoryUserRepository(UserRepository):
    def __init__(self) -> None:
        self._by_id: dict[str, User] = {}
        self._by_email: dict[str, User] = {}

    def add(self, user: User) -> User:
        self._by_id[user.id] = user
        self._by_email[user.email] = user
        return user

    def get_by_email(self, email: str) -> User | None:
        return self._by_email.get(email)

    def get_by_id(self, user_id: str) -> User | None:
        return self._by_id.get(user_id)
