"""FastAPI dependency wiring.

This is where the abstraction (port) is bound to a concrete adapter. Tests can
override ``get_session`` to point the same wiring at SQLite; production binds
it to Postgres — no use case changes.
"""
from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.services import MatchingService, PlacementService
from app.infrastructure.db import get_session
from app.infrastructure.repositories import SqlAlchemyPlacementRepository


def get_placement_service(session: Session = Depends(get_session)) -> PlacementService:
    return PlacementService(SqlAlchemyPlacementRepository(session))


def get_matching_service(session: Session = Depends(get_session)) -> MatchingService:
    return MatchingService(SqlAlchemyPlacementRepository(session))
