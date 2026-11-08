"""Jobs Portal catalogue integration tests."""


def test_jobs_catalogue_is_live_and_embeds_organisation(client):
    response = client.get("/jobs")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 4
    job = next(item for item in body["items"] if item["id"] == "j1")
    assert job["title"] == "Junior Product Designer"
    assert job["org"]["name"] == "Lumen Labs"
    assert job["requirements"] == ["Figma", "UI Design", "Portfolio"]


def test_jobs_catalogue_filters_by_search_and_location(client):
    search = client.get("/jobs", params={"q": "data"})
    assert {item["id"] for item in search.json()["items"]} == {"j2"}
    location = client.get("/jobs", params={"location": "Kampala"})
    assert {item["id"] for item in location.json()["items"]} == {"j2", "j4"}


def test_job_detail_returns_404_for_missing_job(client):
    assert client.get("/jobs/j1").status_code == 200
    assert client.get("/jobs/missing").status_code == 404
