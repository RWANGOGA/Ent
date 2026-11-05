"""Domain/infrastructure error types shared across layers."""


class DomainError(Exception):
    """Base for application/domain rule violations."""


class PlacementNotFound(DomainError):
    """No placement exists with the requested id."""


class PlacementNotOpen(DomainError):
    """The placement exists but is Closed and can't accept new applications."""


class LLMNotConfigured(RuntimeError):
    """Raised when the advisor is called but Groq is not configured."""
