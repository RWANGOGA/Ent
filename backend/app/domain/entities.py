"""Domain entities and value objects for the Placements bounded context."""
from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class Organisation:
    """An employer / institution that hosts placements."""

    id: str
    name: str
    type: str  # Government | Company | NGO | University
    sector: str
    loc: str
    seal: str  # monogram shown in place of a logo
    about: str = ""


@dataclass(frozen=True)
class Placement:
    """A single internship posting. ``org`` is a read-view reference resolved
    by the repository so clients can render the employer inline."""

    id: str
    title: str
    org_id: str
    courses: list[str] = field(default_factory=list)
    grade: str = ""
    loc: str = ""
    mode: str = ""  # On-site | Hybrid | Remote
    duration: str = ""
    stipend: str = ""
    deadline: str = ""
    slots: int = 0
    status: str = "Open"  # Open | Closing | Closed
    applicants: int = 0
    docs: list[str] = field(default_factory=list)
    testimonial: bool = False
    about: str = ""
    duties: list[str] = field(default_factory=list)
    org: Optional[Organisation] = None


# Application workflow statuses (kept as plain strings to stay persistence-friendly).
APPLICATION_STATUSES = ("Submitted", "In Review", "Accepted", "Rejected")


@dataclass(frozen=True)
class Application:
    """A student's submission to a placement. One row per (user, placement)."""

    id: str
    user_id: str
    placement_id: str
    status: str = "Submitted"
    statement: str = ""
    created_at: str = ""


@dataclass(frozen=True)
class Subscription:
    """A host organisation's live billing state (placement-fee plan).

    ``plan == "Free"`` means no paid plan; the free posting allowance then
    applies. Premium lives with employers/institutions, never students.
    """

    org_id: str
    plan: str = "Free"
    billing: str = ""
    seats: int = 1
    since: str = ""

    @property
    def is_premium(self) -> bool:
        return self.plan != "Free"

