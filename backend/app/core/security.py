"""Authentication primitives: password hashing and access tokens.

Password hashing uses only the standard library (PBKDF2-HMAC-SHA256 with a
per-user salt), so there is no compiled crypto dependency and the scheme is
constant-time verified. Access tokens are signed JWTs (HS256) whose secret comes
from settings — never committed. Both are pure functions, so the auth service
stays testable without a database.
"""
from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import get_settings

_ALGO = "sha256"
_ITERATIONS = 240_000
_PREFIX = "pbkdf2_sha256"


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac(_ALGO, password.encode("utf-8"), salt, _ITERATIONS)
    return f"{_PREFIX}${_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        prefix, iters, salt_hex, hash_hex = stored.split("$")
        if prefix != _PREFIX:
            return False
        iterations = int(iters)
    except (ValueError, TypeError):
        return False
    dk = hashlib.pbkdf2_hmac(
        _ALGO, password.encode("utf-8"), bytes.fromhex(salt_hex), iterations
    )
    return hmac.compare_digest(dk.hex(), hash_hex)


def create_access_token(subject: str, role: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": now + timedelta(minutes=settings.access_token_ttl_minutes),
    }
    return jwt.encode(payload, settings.effective_secret_key, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Return the token payload, or raise jwt.InvalidTokenError (incl. expiry)."""
    settings = get_settings()
    return jwt.decode(token, settings.effective_secret_key, algorithms=["HS256"])
