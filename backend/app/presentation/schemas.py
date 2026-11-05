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
