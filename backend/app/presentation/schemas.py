"""API response schemas (transport concern only)."""
from typing import Optional

from pydantic import BaseModel, ConfigDict


class OrganisationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    type: str
    sector: str
    loc: str
    seal: str
    about: str = ""


class PlacementRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    org_id: str
    courses: list[str]
    grade: str
    loc: str
    mode: str
    duration: str
    stipend: str
    deadline: str
    slots: int
    status: str
    applicants: int
    docs: list[str]
    testimonial: bool
    about: str
    duties: list[str]
    org: Optional[OrganisationRead] = None


class PlacementListResponse(BaseModel):
    total: int
    items: list[PlacementRead]


class SkillRead(BaseModel):
    name: str
    category: str
    keywords: list[str]


class CatalogMetaRead(BaseModel):
    """Everything the frontend used to hardcode: the course/type/location filter
    values derived from the live catalog, plus the matching tables owned by the
    domain (grade thresholds, skill taxonomy, per-placement requirements)."""

    courses: list[str]
    org_types: list[str]
    locations: list[str]
    grade_rules: dict[str, float]
    required_skills: dict[str, list[str]]
    skills: list[SkillRead]


class MatchRead(BaseModel):
    score: int
    matched: list[str]
    missing: list[str]
    course_fit: bool
    grade_fit: bool


class RankedPlacementRead(BaseModel):
    placement: PlacementRead
    match: MatchRead


class MatchRequest(BaseModel):
    skills: list[str] = []
    course: str = ""
    cgpa: float = 0.0
    # optional catalogue filters (same as GET /placements)
    q: Optional[str] = None
    org_type: Optional[str] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    limit: Optional[int] = None


class MatchResponse(BaseModel):
    total: int
    items: list[RankedPlacementRead]


class ExtractRequest(BaseModel):
    text: str


class ExtractResponse(BaseModel):
    skills: list[str]


class AdvisorRequest(BaseModel):
    message: str
    skills: list[str] = []
    course: str = ""
    cgpa: float = 0.0


class AdvisorResponse(BaseModel):
    reply: str


# ---------------- B4: user state (saved, applications, subscription) -------


class SavedListResponse(BaseModel):
    saved_ids: list[str]


class ToggleSavedRequest(BaseModel):
    placement_id: str
    # R1d: identity comes from the Bearer token. Kept optional so an in-flight
    # client that still sends it isn't rejected; the router ignores it.
    user_id: Optional[str] = None


class ToggleSavedResponse(BaseModel):
    saved: bool
    saved_ids: list[str]


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    placement_id: str
    status: str
    statement: str
    created_at: str


class ApplyRequest(BaseModel):
    placement_id: str
    statement: str = ""
    # R1d: ignored — the applicant is the authenticated user from the token.
    user_id: Optional[str] = None


class ApplicationsResponse(BaseModel):
    total: int
    items: list[ApplicationRead]


class StudentProfileRead(BaseModel):
    user_id: str
    course: str
    year: str
    cgpa: float
    university: str
    skills: list[str]


class StudentProfileUpdate(BaseModel):
    course: str = ""
    year: str = ""
    cgpa: float = 0.0
    university: str = ""
    skills: list[str] = []


class ResumeRead(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    uploaded_at: str


class StudentDocumentRead(BaseModel):
    id: str
    document_type: str
    filename: str
    content_type: str
    size_bytes: int
    status: str
    rejection_reason: str
    uploaded_at: str


class StudentDocumentsResponse(BaseModel):
    items: list[StudentDocumentRead]


class SubscriptionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    org_id: str
    plan: str
    billing: str
    seats: int
    since: str
    is_premium: bool


class ActivatePlanRequest(BaseModel):
    plan: str
    billing: str = "Card"
    seats: int = 1
    # R1d: org is derived from the token for employers. An admin may target an
    # org explicitly; ignored otherwise.
    org_id: Optional[str] = None


class CancelPlanRequest(BaseModel):
    org_id: Optional[str] = None


# ---------------- Auth ------------------------------------------------------


class RegisterRequest(BaseModel):
    email: str
    name: str = ""
    role: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    name: str
    role: str
    org_id: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
