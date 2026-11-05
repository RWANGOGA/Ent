"""Auth use cases — register, authenticate, resolve the current user.

Depends only on the ``UserRepository`` port plus the pure ``security`` helpers,
so it runs identically against Postgres and the SQLite test harness and is fully
offline-testable.
"""
from uuid import uuid4
from datetime import date

from app.application.ports import UserRepository
from app.core.errors import EmailAlreadyExists, InvalidCredentials, UserNotFound
from app.core.security import hash_password, verify_password
from app.domain.entities import USER_ROLES, User


class AuthService:
    def __init__(self, users: UserRepository) -> None:
        self._users = users

    def register(
        self, *, email: str, name: str, role: str, password: str
    ) -> User:
        email = email.strip().lower()
        role = role.strip()
        if role not in USER_ROLES:
            raise ValueError(f"Unknown role: {role!r}")
        if not email or "@" not in email:
            raise ValueError("A valid email is required")
        if not password:
            raise ValueError("A password is required")
        if self._users.get_by_email(email) is not None:
            raise EmailAlreadyExists(email)

        user = User(
            id=uuid4().hex,
            email=email,
            name=name.strip() or email.split("@")[0],
            role=role,
            password_hash=hash_password(password),
            created_at=date.today().isoformat(),
        )
        return self._users.add(user)

    def login(self, *, email: str, password: str) -> User:
        user = self._users.get_by_email(email.strip().lower())
        # Same error for unknown email and wrong password: don't leak existence.
        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentials()
        return user

    def get(self, user_id: str) -> User:
        user = self._users.get_by_id(user_id)
        if user is None:
            raise UserNotFound(user_id)
        return user
