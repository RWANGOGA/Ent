"""Domain layer — the heart of the model, free of frameworks and I/O.

Entities here are plain immutable dataclasses. They know nothing about
FastAPI, SQLAlchemy or Groq (Dependency Inversion at the architectural edge).
"""
from app.domain.entities import Organisation, Placement

__all__ = ["Organisation", "Placement"]
