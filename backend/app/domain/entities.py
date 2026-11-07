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
class StudentProfile:
    """Persisted academic profile used by internship matching."""

    user_id: str
    course: str = ""
    year: str = ""
    cgpa: float = 0.0
    university: str = ""
    skills: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class Resume:
    user_id: str
    filename: str
    content_type: str
    size_bytes: int
    content: bytes
    uploaded_at: str


@dataclass(frozen=True)
class StudentDocument:
    id: str
    user_id: str
    document_type: str
    filename: str
    content_type: str
    size_bytes: int
    content: bytes
    status: str = "pending"
    rejection_reason: str = ""
    uploaded_at: str = ""


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


# Account roles. Mirrors the four dashboards the product exposes.
USER_ROLES = ("student", "jobseeker", "employer", "admin")


@dataclass(frozen=True)
class User:
    """An authenticated account. ``password_hash`` never leaves the domain —
    the presentation layer exposes a safe view without it. ``org_id`` links
    employer accounts to the organisation they act on (R1d: user-state
    endpoints derive the org from the token instead of a request parameter)."""

    id: str
    email: str
    name: str
    role: str
    password_hash: str
    created_at: str = ""


