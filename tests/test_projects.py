from tests.factories import ProjectFactory, UserFactory
from tests.jwt_helpers import token_for


def test_users_can_get_projects(client, db_session):
    for _ in range(2):
        ProjectFactory()

    r = client.get("/projects")
    assert r.status_code == 200, r.text
    assert len(r.json()) == 2


def test_user_cannot_create_project(client, db_session):
    user = UserFactory()
    token = token_for(user)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None,
    }

    r = client.post(
        "/admin/projects", json=payload, headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 403, r.text


def test_user_can_get_single_project(client, db_session):
    project1 = ProjectFactory(title="Project 1")
    ProjectFactory(title="Project 2")

    r = client.get(f"/projects/{project1.slug}")
    assert r.status_code == 200, r.text
    assert r.json()["title"] == "Project 1"


def test_user_cannot_get_missing_project(client, db_session):
    r = client.get("/projects/wrong-project")
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"
