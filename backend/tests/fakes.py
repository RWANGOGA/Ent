"""Test doubles. A deterministic LLMClient so advisor tests never hit Groq."""
from app.application.ports import LLMClient


class FakeLLM(LLMClient):
    def __init__(self, canned: str = "Here is your advice.") -> None:
        self.canned = canned
        self.last_prompt: str | None = None
        self.calls = 0

    def complete(self, prompt: str) -> str:
        self.last_prompt = prompt
        self.calls += 1
        return self.canned
