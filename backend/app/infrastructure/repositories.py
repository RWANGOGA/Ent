"""Repository adapters — implementations of the application ports.

``SqlAlchemyPlacementRepository`` is the only place that touches the ORM and
maps rows back into domain entities. The rest of the app depends on the
abstract port, so this class could be replaced (e.g. a fake, or a different
store) without touching a single use case.
"""
from typing import Optional

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.application.ports import (
    ApplicationRepository,
    PlacementRepository,
    SavedRepository,
    StudentProfileRepository,
    ResumeRepository,
    SubscriptionRepository,
    UserRepository,
)
from app.domain.entities import (
    Application,
    Organisation,
    Placement,
    StudentProfile,
    Subscription,
    User,
)
from app.infrastructure.orm import (
    ApplicationORM,
    OrganisationORM,
    PlacementORM,
    SavedORM,
    StudentProfileORM,
    SubscriptionORM,
    UserORM,
)


class SqlAlchemyPlacementRepository(PlacementRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def _to_domain(self, row: PlacementORM, org: Optional[OrganisationORM]) -> Placement:
        organisation = (
            Organisation(
                id=org.id,
                name=org.name,
                type=org.type,
                sector=org.sector or "",
                loc=org.loc or "",
                seal=org.seal or "",
                about=org.about or "",
            )
            if org is not None
            else None
        )
        return Placement(
            id=row.id,
            title=row.title,
            org_id=row.org_id,
            courses=list(row.courses or []),
            grade=row.grade or "",
            loc=row.loc or "",
            mode=row.mode or "",
            duration=row.duration or "",
            stipend=row.stipend or "",
            deadline=row.deadline or "",
            slots=row.slots or 0,
            status=row.status or "Open",
            applicants=row.applicants or 0,
            docs=list(row.docs or []),
            testimonial=bool(row.testimonial),
            about=row.about or "",
            duties=list(row.duties or []),
            org=organisation,
        )

    def _base_query(self):
        return self._session.query(PlacementORM, OrganisationORM).outerjoin(
            OrganisationORM, PlacementORM.org_id == OrganisationORM.id
        )

    def list(
        self,
        *,
        q: Optional[str] = None,
        org_type: Optional[str] = None,
        location: Optional[str] = None,
        mode: Optional[str] = None,
    ) -> list[Placement]:
        query = self._base_query()
        if org_type:
            query = query.filter(OrganisationORM.type == org_type)
        if location:
            query = query.filter(OrganisationORM.loc == location)
        if mode:
            query = query.filter(PlacementORM.mode == mode)
        if q:
            like = f"%{q.strip().lower()}%"
            query = query.filter(
                or_(
                    func.lower(PlacementORM.title).like(like),
                    func.lower(OrganisationORM.name).like(like),
                    func.lower(PlacementORM.loc).like(like),
                )
            )
        return [self._to_domain(p, o) for p, o in query.order_by(PlacementORM.id).all()]

    def get(self, placement_id: str) -> Optional[Placement]:
        row = self._base_query().filter(PlacementORM.id == placement_id).first()
        if row is None:
            return None
        return self._to_domain(row[0], row[1])


class SqlAlchemySavedRepository(SavedRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def list(self, user_id: str) -> list[str]:
        rows = (
            self._session.query(SavedORM.placement_id)
            .filter(SavedORM.user_id == user_id)
            .order_by(SavedORM.placement_id)
            .all()
        )
        return [r[0] for r in rows]

    def is_saved(self, user_id: str, placement_id: str) -> bool:
        return (
            self._session.query(SavedORM)
            .filter_by(user_id=user_id, placement_id=placement_id)
            .first()
            is not None
        )

    def toggle(self, user_id: str, placement_id: str) -> bool:
        existing = (
            self._session.query(SavedORM)
            .filter_by(user_id=user_id, placement_id=placement_id)
            .first()
        )
        if existing is not None:
            self._session.delete(existing)
            self._session.commit()
            return False
        self._session.add(SavedORM(user_id=user_id, placement_id=placement_id))
        self._session.commit()
        return True


class SqlAlchemyApplicationRepository(ApplicationRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_domain(row: ApplicationORM) -> Application:
        return Application(
            id=row.id,
            user_id=row.user_id,
            placement_id=row.placement_id,
            status=row.status,
            statement=row.statement or "",
            created_at=row.created_at or "",
        )

    def add(self, application: Application) -> Application:
        self._session.add(
            ApplicationORM(
                id=application.id,
                user_id=application.user_id,
                placement_id=application.placement_id,
                status=application.status,
                statement=application.statement,
                created_at=application.created_at,
            )
        )
        self._session.commit()
        return application

    def find(self, user_id: str, placement_id: str) -> Optional[Application]:
        row = (
            self._session.query(ApplicationORM)
            .filter_by(user_id=user_id, placement_id=placement_id)
            .first()
        )
        return self._to_domain(row) if row is not None else None

    def list_for_user(self, user_id: str) -> list[Application]:
        rows = (
            self._session.query(ApplicationORM)
            .filter_by(user_id=user_id)
            .order_by(ApplicationORM.created_at.desc(), ApplicationORM.id)
            .all()
        )
        return [self._to_domain(r) for r in rows]

    def list_for_placement(self, placement_id: str) -> list[Application]:
        rows = (
            self._session.query(ApplicationORM)
            .filter_by(placement_id=placement_id)
            .order_by(ApplicationORM.created_at.desc(), ApplicationORM.id)
            .all()
        )
        return [self._to_domain(r) for r in rows]


class SqlAlchemySubscriptionRepository(SubscriptionRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def get(self, org_id: str) -> Subscription:
        row = self._session.query(SubscriptionORM).filter_by(org_id=org_id).first()
        if row is None:
            return Subscription(org_id=org_id)  # Free default
        return Subscription(
            org_id=row.org_id,
            plan=row.plan,
            billing=row.billing or "",
            seats=row.seats or 1,
            since=row.since or "",
        )

    def save(self, subscription: Subscription) -> Subscription:
        row = (
            self._session.query(SubscriptionORM).filter_by(org_id=subscription.org_id).first()
        )
        if row is None:
            row = SubscriptionORM(org_id=subscription.org_id)
            self._session.add(row)
        row.plan = subscription.plan
        row.billing = subscription.billing
        row.seats = subscription.seats
        row.since = subscription.since
        self._session.commit()
        return subscription


class SqlAlchemyStudentProfileRepository(StudentProfileRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_domain(row: StudentProfileORM) -> StudentProfile:
        return StudentProfile(
            user_id=row.user_id,
            course=row.course or "",
            year=row.year or "",
            cgpa=float(row.cgpa or 0.0),
            university=row.university or "",
            skills=list(row.skills or []),
        )

    def get(self, user_id: str) -> StudentProfile:
        row = self._session.query(StudentProfileORM).filter_by(user_id=user_id).first()
        return self._to_domain(row) if row is not None else StudentProfile(user_id=user_id)

    def save(self, profile: StudentProfile) -> StudentProfile:
        row = (
            self._session.query(StudentProfileORM)
            .filter_by(user_id=profile.user_id)
            .first()
        )
        if row is None:
            row = StudentProfileORM(user_id=profile.user_id)
            self._session.add(row)
        row.course = profile.course
        row.year = profile.year
        row.cgpa = profile.cgpa
        row.university = profile.university
        row.skills = profile.skills
        self._session.commit()
        return profile


class SqlAlchemyResumeRepository(ResumeRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_domain(row: ResumeORM) -> Resume:
        return Resume(
            user_id=row.user_id,
            filename=row.filename,
            content_type=row.content_type,
            size_bytes=row.size_bytes,
            content=row.content,
            uploaded_at=row.uploaded_at or "",
        )

    def get(self, user_id: str) -> Optional[Resume]:
        row = self._session.query(ResumeORM).filter_by(user_id=user_id).first()
        return self._to_domain(row) if row is not None else None

    def save(self, resume: Resume) -> Resume:
        row = self._session.query(ResumeORM).filter_by(user_id=resume.user_id).first()
        if row is None:
            row = ResumeORM(user_id=resume.user_id)
            self._session.add(row)
        row.filename = resume.filename
        row.content_type = resume.content_type
        row.size_bytes = resume.size_bytes
        row.content = resume.content
        row.uploaded_at = resume.uploaded_at
        self._session.commit()
        return resume


class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_domain(row: UserORM) -> User:
        return User(
            id=row.id,
            email=row.email,
            name=row.name,
            role=row.role,
            password_hash=row.password_hash,
            created_at=row.created_at or "",
        )

    def add(self, user: User) -> User:
        self._session.add(
            UserORM(
                id=user.id,
                email=user.email,
                name=user.name,
                role=user.role,
                password_hash=user.password_hash,
                created_at=user.created_at,
            )
        )
        self._session.commit()
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        row = self._session.query(UserORM).filter_by(email=email).first()
        return self._to_domain(row) if row is not None else None

    def get_by_id(self, user_id: str) -> Optional[User]:
        row = self._session.query(UserORM).filter_by(id=user_id).first()
        return self._to_domain(row) if row is not None else None
