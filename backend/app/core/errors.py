"""Domain/infrastructure error types shared across layers."""


class LLMNotConfigured(RuntimeError):
    """Raised when the advisor is called but Groq is not configured.

    The API turns this into a clear 503 instead of a stack trace, so the app
    boots and every other endpoint works even before a key/model is set.
    """
