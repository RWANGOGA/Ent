"""Repository adapters — implementations of the application ports.

``SqlAlchemyPlacementRepository`` is the only place that touches the ORM and
maps rows back into domain entities. The rest of the app depends on the
abstract port, so this class could be replaced (e.g. a fake, or a different
store) without touching a single use case.
"""
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.application.ports import PlacementRepository
from app.domain.entities import Organisation, Placement
from app.infrastructure.orm import OrganisationORM, PlacementORM


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
