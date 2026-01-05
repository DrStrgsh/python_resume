from tests.factories import ProjectFactory, UserFactory, AdminFactory
from tests.jwt_helpers import authenticate_client


def test_users_can_get_projects(client, db_session):
    for _ in range(2):
        ProjectFactory.create()

    r = client.get("/api/projects")
    assert r.status_code == 200, r.text
    assert len(r.json()) == 2


def test_user_cannot_create_project(client, db_session):
    user = UserFactory.create()
    authenticate_client(client, user)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None,
    }

    r = client.post("/api/projects", json=payload)
    assert r.status_code == 403, r.text


def test_user_can_get_single_project(client, db_session):
    project1 = ProjectFactory.create(title="Project 1")
    ProjectFactory.create(title="Project 2")

    r = client.get(f"/api/projects/{project1.slug}")
    assert r.status_code == 200, r.text
    assert r.json()["title"] == "Project 1"


def test_user_cannot_get_missing_project(client, db_session):
    r = client.get("/api/projects/wrong-project")
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"


def test_admin_can_create_project(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None,
    }

    r = client.post("/api/projects", json=payload)
    assert r.status_code in (200, 201), r.text
    assert r.json()["title"] == "Project"


def test_admin_cannot_create_project_with_existing_slug(client, db_session):
    admin = AdminFactory.create()
    ProjectFactory(slug="project")
    authenticate_client(client, admin)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None,
    }

    r = client.post("/api/projects", json=payload)
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Slug already exists"


def test_admin_can_update_project(client, db_session):
    admin = AdminFactory.create()
    project = ProjectFactory.create()
    authenticate_client(client, admin)
    payload = {
        "title": "Updated Project",
        "slug": "updated-project",
        "description": "Desc",
    }

    r = client.put(f"/api/projects/{project.id}", json=payload)
    assert r.status_code in (200, 201), r.text
    assert r.json()["title"] == "Updated Project"
    assert r.json()["slug"] == "updated-project"
    assert r.json()["description"] == "Desc"


def test_admin_cannot_update_missing_project(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)
    payload = {"title": "Project", "slug": "project", "description": "Desc"}

    r = client.put("/api/projects/9999", json=payload)
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"


def test_admin_cannot_change_slug_to_existing_slug(client, db_session):
    admin = AdminFactory.create()
    project = ProjectFactory.create()
    ProjectFactory.create(slug="project")
    authenticate_client(client, admin)
    payload = {"title": "Good Project", "slug": "project", "description": "Desc"}

    r = client.put(f"/api/projects/{project.id}", json=payload)
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Slug already exists"


def test_admin_can_delete_project(client, db_session):
    admin = AdminFactory.create()
    project = ProjectFactory.create()
    authenticate_client(client, admin)

    r = client.delete(f"/api/projects/{project.id}")
    assert r.status_code == 200, r.text
    assert r.json()["message"] == "Deleted"


def test_admin_cannot_delete_missing_project(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)

    r = client.delete("/api/projects/9999")
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"
