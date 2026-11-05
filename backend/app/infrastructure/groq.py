"""Groq adapter — the concrete LLMClient for production.

Implements the ``LLMClient`` port. It reads the key and model from settings
(never hardcoded) and raises ``LLMNotConfigured`` — before any network call —
when either is missing, so the app stays healthy until you opt in.
"""
from typing import Optional

from app.application.ports import LLMClient
from app.core.config import Settings, get_settings
from app.core.errors import LLMNotConfigured


class GroqClient(LLMClient):
    def __init__(self, settings: Optional[Settings] = None) -> None:
        s = settings or get_settings()
        self._api_key = s.groq_api_key
        self._model = s.groq_model
        self._client = None
        if self._api_key:
            # Import lazily so the rest of the app runs even without the SDK.
            from groq import Groq

            self._client = Groq(api_key=self._api_key)

    def complete(self, prompt: str) -> str:
        if self._client is None or not self._model:
            raise LLMNotConfigured(
                "Groq advisor is not configured. Set GROQ_API_KEY and "
                "GROQ_MODEL in backend/.env.local."
            )
        completion = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=512,
        )
        return (completion.choices[0].message.content or "").strip()
