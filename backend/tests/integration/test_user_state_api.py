"""B4 HTTP tests — saved, applications and subscription against the isolated
seeded SQLite database via the mounted sub-app.

R1d: these endpoints now derive the actor from the Bearer token, so every test
logs in as a real demo account and asserts that identity comes from the token
(not from a user_id/org_id the client sends).
"""

STUDENT = "amina@makerere.ac.ug"
EMPLOYER = "hiring@lumenlabs.example"  # linked to org o4
ADMIN = "office@makerere.ac.ug"
JOBSEEKER = "brian@example.com"
PASSWORD = "password123"


def _login(client, email: str) -> dict:
    resp = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert resp.status_code == 200, resp.text
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def _user_id(client, email: str) -> str:
    return client.get("/auth/me", headers=_login(client, email)).json()["id"]


# ---- Auth enforcement ------------------------------------------------------


def test_user_state_requires_a_token(client):
    assert client.get("/saved").status_code == 401
    assert client.post("/saved/toggle", json={"placement_id": "p1"}).status_code == 401
    assert client.post("/applications", json={"placement_id": "p1"}).status_code == 401
    assert client.get("/applications").status_code == 401
    assert client.get("/subscription").status_code == 401


# ---- Saved -----------------------------------------------------------------


def test_toggle_saved_then_list(client):
    h = _login(client, STUDENT)
    resp = client.post("/saved/toggle", json={"placement_id": "p1"}, headers=h)
    assert resp.status_code == 200
    assert resp.json()["saved"] is True
    assert resp.json()["saved_ids"] == ["p1"]

    assert client.get("/saved", headers=h).json()["saved_ids"] == ["p1"]

    # toggling again removes it
    resp = client.post("/saved/toggle", json={"placement_id": "p1"}, headers=h)
    assert resp.json()["saved"] is False
    assert resp.json()["saved_ids"] == []


def test_saved_is_per_account(client):
    a = _login(client, STUDENT)
    b = _login(client, JOBSEEKER)
    client.post("/saved/toggle", json={"placement_id": "p1"}, headers=a)
    # a bookmark by one account is invisible to another — identity is the token
    assert client.get("/saved", headers=b).json()["saved_ids"] == []


# ---- Applications ----------------------------------------------------------


def test_apply_persists_and_is_idempotent(client):
    h = _login(client, STUDENT)
    uid = _user_id(client, STUDENT)
    resp = client.post(
        "/applications", json={"placement_id": "p1", "statement": "keen"}, headers=h
    )
    assert resp.status_code == 201
    created = resp.json()
    assert created["status"] == "Submitted"
    assert created["placement_id"] == "p1"
    # the applicant id is the token's user, whatever the client tried to send
    assert created["user_id"] == uid

    # applying again returns the same row (idempotent)
    resp2 = client.post("/applications", json={"placement_id": "p1"}, headers=h)
    assert resp2.status_code == 201
    assert resp2.json()["id"] == created["id"]

    assert client.get("/applications", headers=h).json()["total"] == 1


def test_ignored_body_user_id_cannot_spoof_another_account(client):
    h = _login(client, STUDENT)
    uid = _user_id(client, STUDENT)
    resp = client.post(
        "/applications", json={"placement_id": "p2", "user_id": "someone-else"}, headers=h
    )
    assert resp.status_code == 201
    assert resp.json()["user_id"] == uid


def test_applicants_requires_hiring_role(client):
    student = _login(client, STUDENT)
    employer = _login(client, EMPLOYER)
    # student can't see who applied
    assert client.get("/placements/p1/applicants", headers=student).status_code == 403
    # employer (hiring side) can
    assert client.get("/placements/p1/applicants", headers=employer).status_code == 200


def test_apply_unknown_placement_is_404(client):
    h = _login(client, STUDENT)
    resp = client.post("/applications", json={"placement_id": "does-not-exist"}, headers=h)
    assert resp.status_code == 404


# ---- Student profile -------------------------------------------------------


def test_student_profile_is_empty_until_saved_then_persists(client):
    h = _login(client, STUDENT)
    empty = client.get("/profile", headers=h)
    assert empty.status_code == 200
    assert empty.json()["course"] == ""
    assert empty.json()["skills"] == []

    updated = client.put(
        "/profile",
        json={
            "course": " Design ",
            "year": "Year 3",
            "cgpa": 3.7,
            "university": "Makerere University",
            "skills": ["Figma", "Figma", " UI Design "],
        },
        headers=h,
    )
    assert updated.status_code == 200
    assert updated.json()["course"] == "Design"
    assert updated.json()["skills"] == ["Figma", "UI Design"]
    assert client.get("/profile", headers=h).json()["university"] == "Makerere University"


def test_non_student_cannot_access_student_profile(client):
    h = _login(client, JOBSEEKER)
    assert client.get("/profile", headers=h).status_code == 403
    assert client.put("/profile", json={}, headers=h).status_code == 403


# ---- Subscription ----------------------------------------------------------


def test_subscription_derives_org_from_the_employer_token(client):
    h = _login(client, EMPLOYER)  # org o4
    default = client.get("/subscription", headers=h).json()
    assert default["org_id"] == "o4"
    assert default["plan"] == "Free"
    assert default["is_premium"] is False

    activated = client.post(
        "/subscription/activate",
        json={"plan": "Growth", "billing": "Card", "seats": 3},
        headers=h,
    ).json()
    assert activated["plan"] == "Growth"
    assert activated["is_premium"] is True
    assert activated["seats"] == 3
    assert activated["since"]

    # persists across reads (keyed by the token's org, no org_id sent)
    assert client.get("/subscription", headers=h).json()["plan"] == "Growth"

    cancelled = client.post("/subscription/cancel", json={}, headers=h).json()
    assert cancelled["plan"] == "Free"
    assert cancelled["is_premium"] is False


def test_student_cannot_access_subscription(client):
    h = _login(client, STUDENT)
    assert client.get("/subscription", headers=h).status_code == 403


def test_admin_may_target_an_org_explicitly(client):
    h = _login(client, ADMIN)
    resp = client.get("/subscription?org_id=o5", headers=h)
    assert resp.status_code == 200
    assert resp.json()["org_id"] == "o5"
