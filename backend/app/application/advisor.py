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
    "You are a concise career advisor for a skills-to-opportunity internship "
    "platform. Base every answer only on the listed opportunities."
)

_ROLE_CONTEXT = {
    "student": "You are helping a university student find and apply for internships.",
    "jobseeker": "You are helping a job seeker find and apply for graduate roles.",
    "employer": "You are helping an employer manage their internship and job postings.",
    "admin": "You are helping a platform administrator oversee the system.",
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
        lines.append("Conversation history:")
        for msg in history[-6:]:  # Last 6 messages
            who = "Student" if msg.get("who") == "me" else "Advisor"
            lines.append(f"  {who}: {msg.get('text', '')[:200]}")
        lines.append("")
    lines.append(f"Student question: {question}")
    lines.append(
        "Reply in at most 4 short sentences: name the single best role to target "
        "now and the top 1-2 skills that would most improve the match. Do not "
        "invent opportunities that are not listed. If the user asks to take an "
        "action (apply, check eligibility, view placement), suggest it naturally "
        "in your response."
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
