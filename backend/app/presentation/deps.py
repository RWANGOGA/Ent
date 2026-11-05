"""FastAPI dependency wiring.

This is where the abstraction (port) is bound to a concrete adapter. Tests can
override ``get_session`` to point the same wiring at SQLite; production binds
it to Postgres — no use case changes.
"""
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.application.advisor import AdvisorService
from app.application.auth import AuthService
from app.application.ports import LLMClient
from app.application.services import (
    ApplicationService,
    BillingService,
    MatchingService,
    PlacementService,
    SavedService,
)
from app.core.errors import AuthenticationError, UserNotFound
from app.core.security import decode_access_token
from app.domain.entities import User
from app.infrastructure.db import get_session
from app.infrastructure.groq import GroqClient
from app.infrastructure.repositories import (
    SqlAlchemyApplicationRepository,
    SqlAlchemyPlacementRepository,
    SqlAlchemySavedRepository,
    SqlAlchemySubscriptionRepository,
    SqlAlchemyUserRepository,
)


def get_placement_service(session: Session = Depends(get_session)) -> PlacementService:
    return PlacementService(SqlAlchemyPlacementRepository(session))


def get_matching_service(session: Session = Depends(get_session)) -> MatchingService:
    return MatchingService(SqlAlchemyPlacementRepository(session))


def get_llm_client() -> LLMClient:
    """Production binds Groq; tests override this to a deterministic fake."""
    return GroqClient()


def get_advisor_service(
    session: Session = Depends(get_session),
    llm: LLMClient = Depends(get_llm_client),
) -> AdvisorService:
    return AdvisorService(MatchingService(SqlAlchemyPlacementRepository(session)), llm)


def get_saved_service(session: Session = Depends(get_session)) -> SavedService:
    return SavedService(SqlAlchemySavedRepository(session))


def get_application_service(
    session: Session = Depends(get_session),
) -> ApplicationService:
    return ApplicationService(
        SqlAlchemyPlacementRepository(session), SqlAlchemyApplicationRepository(session)
    )


def get_billing_service(session: Session = Depends(get_session)) -> BillingService:
    return BillingService(SqlAlchemySubscriptionRepository(session))


# ---- Auth ------------------------------------------------------------------

bearer_scheme = HTTPBearer(auto_error=False)


def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    return AuthService(SqlAlchemyUserRepository(session))


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    service: AuthService = Depends(get_auth_service),
) -> User:
    """Resolve the caller from a valid Bearer token, or raise 401."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise AuthenticationError("Not authenticated")
    try:
        payload = decode_access_token(credentials.credentials)
    except Exception as exc:  # jwt.InvalidTokenError and friends
        raise AuthenticationError("Invalid or expired token") from exc
    try:
        return service.get(payload["sub"])
    except UserNotFound as exc:
        raise AuthenticationError("Account no longer exists") from exc
