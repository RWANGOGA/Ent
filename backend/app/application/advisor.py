"""Career advisor use case — grounds an LLM answer in the matcher's output.

The prompt composer is a pure function (easy to unit-test), and the service
depends only on the ``MatchingService`` and the ``LLMClient`` port. Swapping
Groq for another model, or the keyword extractor for a smarter one, changes no
callers.
"""
from typing import Optional

from app.application.ports import LLMClient
from app.application.services import MatchingService
from app.domain.matching import RankedPlacement

_SYSTEM = (
    "You are a concise career advisor for a skills-to-opportunity platform. "
    "Base every answer only on the listed opportunities. Never invent placements."
)

_ROLE_CONTEXT = {
    "student": "Help a university student find and apply for internships.",
    "jobseeker": "Help a job seeker find and apply for graduate roles.",
    "employer": "Help an employer manage internship and job postings.",
    "admin": "Help a platform administrator oversee the system.",
}


def compose_prompt(
    question: str,
    skills: list[str],
    course: str,
    cgpa: float,
    ranked: list[RankedPlacement],
    role: str = "student",
    history: list[dict] = None,
    top_n: int = 5,
) -> str:
    history = history or []
    lines = [_SYSTEM, ""]
    role_context = _ROLE_CONTEXT.get(role, _ROLE_CONTEXT["student"])
    lines.append(role_context)
    lines.append(
        f"Student — course: {course or 'unknown'}; CGPA: {cgpa}; "
        f"skills: {', '.join(skills) or 'none listed'}."
    )
    lines.append("Top matches (score | role @ employer | has | add next):")
    for r in ranked[:top_n]:
        p, m = r.placement, r.match
        employer = p.org.name if p.org else "Unknown"
        has = ", ".join(m.matched) or "none"
        add = ", ".join(m.missing[:3]) or "none"
        lines.append(f"- {m.score}% | {p.title} @ {employer} | has: {has} | add: {add}")
    lines.append("")
    if history:
        lines.append("Recent conversation:")
        for msg in history[-4:]:  # Last 4 messages
            who = "Student" if msg.get("who") == "me" else "Advisor"
            lines.append(f"  {who}: {msg.get('text', '')[:150]}")
        lines.append("")
    lines.append(f"Question: {question}")
    lines.append(
        "Reply in 2-3 short sentences. Name the single best role to target now "
        "and the top 1-2 skills to add. If user wants to act (apply, check eligibility), "
        "mention it naturally. Do not repeat the same info if already said."
    )
    return "\n".join(lines)


class AdvisorService:
    def __init__(self, matching: MatchingService, llm: LLMClient) -> None:
        self._matching = matching
        self._llm = llm

    def answer(
        self,
        *,
        message: str,
        skills: Optional[list[str]] = None,
        course: str = "",
        cgpa: float = 0.0,
        role: str = "student",
        history: list[dict] = None,
    ) -> str:
        skills = skills or []
        ranked = self._matching.rank(
            student_skills=skills, student_course=course, student_cgpa=cgpa
        )
        prompt = compose_prompt(message, skills, course, cgpa, ranked, role, history)
        return self._llm.complete(prompt)
