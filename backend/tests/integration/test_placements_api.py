"""End-to-end through the router: HTTP -> service -> repository -> SQLite."""


def test_list_returns_seeded_catalogue(client):
    resp = client.get("/placements")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] == 12
    assert len(body["items"]) == 12
    # employer is embedded for inline rendering
    p1 = next(i for i in body["items"] if i["id"] == "p1")
    assert p1["org"]["name"] == "Lumen Labs"
    assert p1["org"]["seal"] == "LL"


def test_filter_by_org_type(client):
    body = client.get("/placements", params={"org_type": "Government"}).json()
    assert body["total"] == 4
    assert {i["id"] for i in body["items"]} == {"p2", "p6", "p8", "p12"}
    assert all(i["org"]["type"] == "Government" for i in body["items"])


def test_filter_by_location(client):
    body = client.get("/placements", params={"location": "Kampala"}).json()
    assert body["total"] == 7


def test_filter_by_mode(client):
    body = client.get("/placements", params={"mode": "Remote"}).json()
    assert {i["id"] for i in body["items"]} == {"p1", "p11"}


def test_keyword_search(client):
    body = client.get("/placements", params={"q": "design"}).json()
    assert {i["id"] for i in body["items"]} == {"p1", "p11"}


def test_combined_filters(client):
    body = client.get(
        "/placements", params={"org_type": "Company", "mode": "Remote"}
    ).json()
    assert {i["id"] for i in body["items"]} == {"p1", "p11"}


def test_get_single(client):
    body = client.get("/placements/p3").json()
    assert body["title"] == "Software Engineering Intern"
    assert body["org"]["name"] == "Northwind"


def test_get_missing_is_404(client):
    assert client.get("/placements/nope").status_code == 404
