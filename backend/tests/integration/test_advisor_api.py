"""Advisor HTTP tests — override the LLM port so nothing hits Groq."""
from fastapi.testclient import TestClient

from app.presentation.deps import get_llm_client
from app.presentation.main import create_app
from tests.fakes import FakeLLM


def test_advisor_returns_llm_reply_grounded_by_matcher(_prepared_db):
    fake = FakeLLM(canned="Focus on Figma and target Lumen Labs.")
    app = create_app()
    app.dependency_overrides[get_llm_client] = lambda: fake
    with TestClient(app) as c:
        resp = c.post(
            "/advisor",
            json={"message": "what next?", "skills": ["Figma"], "course": "Design", "cgpa": 3.5},
        )
        assert resp.status_code == 200
        assert resp.json()["reply"] == fake.canned
        assert fake.calls == 1
        # the prompt carries real, ranked placement context
        assert "Top matches" in fake.last_prompt
        assert "Product Design Intern" in fake.last_prompt


def test_advisor_503_when_groq_not_configured(client):
    resp = client.post("/advisor", json={"message": "hi"})
    assert resp.status_code == 503
    assert "GROQ" in resp.json()["detail"].upper()
