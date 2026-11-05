"""B4 user-state endpoints — saved, applications and subscription.

Grouped in one module because they share the same shape: a thin HTTP handler
that reads a payload, calls an application service, and maps a domain error to
an HTTP status. Keeping them together (rather than three near-identical
routers) is a small, contained tradeoff that avoids file proliferation.
"""
from fastapi import APIRouter, Depends, HTTPException, Query

from app.application.services import ApplicationService, BillingService, SavedService
from app.core.errors import PlacementNotFound, PlacementNotOpen
from app.presentation.deps import (
    get_application_service,
    get_billing_service,
    get_saved_service,
)
from app.presentation.schemas import (
    ActivatePlanRequest,
    ApplicationRead,
    ApplicationsResponse,
    ApplyRequest,
    CancelPlanRequest,
    SavedListResponse,
    SubscriptionRead,
    ToggleSavedRequest,
    ToggleSavedResponse,
)

router = APIRouter(tags=["user-state"])


# ---- Saved -----------------------------------------------------------------

@router.get("/saved", response_model=SavedListResponse)
def list_saved(
    user_id: str = Query(...),
    service: SavedService = Depends(get_saved_service),
) -> SavedListResponse:
    return SavedListResponse(saved_ids=service.list(user_id))


@router.post("/saved/toggle", response_model=ToggleSavedResponse)
def toggle_saved(
    payload: ToggleSavedRequest,
    service: SavedService = Depends(get_saved_service),
) -> ToggleSavedResponse:
    now_saved, ids = service.toggle(payload.user_id, payload.placement_id)
    return ToggleSavedResponse(saved=now_saved, saved_ids=ids)


# ---- Applications ----------------------------------------------------------

@router.post("/applications", response_model=ApplicationRead, status_code=201)
def apply(
    payload: ApplyRequest,
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationRead:
    try:
        app = service.apply(
            user_id=payload.user_id,
            placement_id=payload.placement_id,
            statement=payload.statement,
        )
    except PlacementNotFound as exc:
        raise HTTPException(status_code=404, detail=f"Placement {exc} not found")
    except PlacementNotOpen as exc:
        raise HTTPException(
            status_code=409, detail=f"Placement {exc} is closed to new applications"
        )
    return ApplicationRead.model_validate(app)


@router.get("/applications", response_model=ApplicationsResponse)
def list_my_applications(
    user_id: str = Query(...),
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationsResponse:
    items = service.list_for_user(user_id)
    return ApplicationsResponse(
        total=len(items), items=[ApplicationRead.model_validate(a) for a in items]
    )


@router.get(
    "/placements/{placement_id}/applicants", response_model=ApplicationsResponse
)
def list_applicants(
    placement_id: str,
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationsResponse:
    items = service.list_for_placement(placement_id)
    return ApplicationsResponse(
        total=len(items), items=[ApplicationRead.model_validate(a) for a in items]
    )


# ---- Subscription ----------------------------------------------------------

@router.get("/subscription", response_model=SubscriptionRead)
def get_subscription(
    org_id: str = Query(...),
    service: BillingService = Depends(get_billing_service),
) -> SubscriptionRead:
    s = service.get(org_id)
    return SubscriptionRead(
        org_id=s.org_id,
        plan=s.plan,
        billing=s.billing,
        seats=s.seats,
        since=s.since,
        is_premium=s.is_premium,
    )


@router.post("/subscription/activate", response_model=SubscriptionRead)
def activate_plan(
    payload: ActivatePlanRequest,
    service: BillingService = Depends(get_billing_service),
) -> SubscriptionRead:
    s = service.activate(payload.org_id, payload.plan, payload.billing, payload.seats)
    return SubscriptionRead(
        org_id=s.org_id,
        plan=s.plan,
        billing=s.billing,
        seats=s.seats,
        since=s.since,
        is_premium=s.is_premium,
    )


@router.post("/subscription/cancel", response_model=SubscriptionRead)
def cancel_plan(
    payload: CancelPlanRequest,
    service: BillingService = Depends(get_billing_service),
) -> SubscriptionRead:
    s = service.cancel(payload.org_id)
    return SubscriptionRead(
        org_id=s.org_id,
        plan=s.plan,
        billing=s.billing,
        seats=s.seats,
        since=s.since,
        is_premium=s.is_premium,
    )
