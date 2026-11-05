"""B4 HTTP tests — saved, applications and subscription against the isolated
seeded SQLite database via the mounted sub-app.
"""


# ---- Saved -----------------------------------------------------------------


def test_toggle_saved_then_list(client):
    resp = client.post("/saved/toggle", json={"user_id": "u1", "placement_id": "p1"})
    assert resp.status_code == 200
    assert resp.json()["saved"] is True
    assert resp.json()["saved_ids"] == ["p1"]

    resp = client.get("/saved", params={"user_id": "u1"})
    assert resp.status_code == 200
    assert resp.json()["saved_ids"] == ["p1"]

    # toggling again removes it
    resp = client.post("/saved/toggle", json={"user_id": "u1", "placement_id": "p1"})
    assert resp.json()["saved"] is False
    assert resp.json()["saved_ids"] == []


# ---- Applications ----------------------------------------------------------


def test_apply_persists_and_is_idempotent(client):
    resp = client.post(
        "/applications",
        json={"user_id": "u1", "placement_id": "p1", "statement": "keen"},
    )
    assert resp.status_code == 201
    created = resp.json()
    assert created["status"] == "Submitted"
    assert created["placement_id"] == "p1"

    # applying again returns the same row (idempotent)
    resp2 = client.post("/applications", json={"user_id": "u1", "placement_id": "p1"})
    assert resp2.status_code == 201
    assert resp2.json()["id"] == created["id"]

    mine = client.get("/applications", params={"user_id": "u1"}).json()
    assert mine["total"] == 1

    applicants = client.get("/placements/p1/applicants").json()
    assert applicants["total"] == 1


def test_apply_unknown_placement_is_404(client):
    resp = client.post(
        "/applications", json={"user_id": "u1", "placement_id": "does-not-exist"}
    )
    assert resp.status_code == 404


# ---- Subscription ----------------------------------------------------------


def test_subscription_lifecycle(client):
    default = client.get("/subscription", params={"org_id": "o1"}).json()
    assert default["plan"] == "Free"
    assert default["is_premium"] is False

    activated = client.post(
        "/subscription/activate",
        json={"org_id": "o1", "plan": "Growth", "billing": "Card", "seats": 3},
    ).json()
    assert activated["plan"] == "Growth"
    assert activated["is_premium"] is True
    assert activated["seats"] == 3
    assert activated["since"]

    # persists across reads
    assert client.get("/subscription", params={"org_id": "o1"}).json()["plan"] == "Growth"

    cancelled = client.post(
        "/subscription/cancel", json={"org_id": "o1"}
    ).json()
    assert cancelled["plan"] == "Free"
    assert cancelled["is_premium"] is False
