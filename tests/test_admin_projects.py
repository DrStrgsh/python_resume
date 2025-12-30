from tests.factories import AdminFactory, ProjectFactory
from tests.jwt_helpers import token_for

def test_admin_can_create_project(client, db_session):
    admin = AdminFactory()
    token = token_for(admin)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None
    }

    r = client.post("/admin/projects", json = payload, headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 201), r.text
    assert r.json()["title"] == "Project"

def test_admin_cannot_create_project_with_existing_slug(client, db_session):
    admin = AdminFactory()
    project = ProjectFactory(slug = "project")
    token = token_for(admin)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc",
        "url": None,
        "repo_url": None,
        "tags": None
    }

    r = client.post("/admin/projects", json = payload, headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Slug already exists"

def test_admin_can_update_project(client, db_session):
    admin = AdminFactory()
    project = ProjectFactory()
    token = token_for(admin)
    payload = {
        "title": "Updated Project",
        "slug": "updated-project",
        "description": "Desc"
    }

    r = client.put(f"/admin/projects/{project.id}", json = payload, headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 201), r.text
    assert r.json()["title"] == "Updated Project"
    assert r.json()["slug"] == "updated-project"
    assert r.json()["description"] == "Desc"

def test_admin_cannot_update_missing_project(client, db_session):
    admin = AdminFactory()
    token = token_for(admin)
    payload = {
        "title": "Project",
        "slug": "project",
        "description": "Desc"
    }

    r = client.put("/admin/projects/9999", json = payload, headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"

def test_admin_cannot_change_slug_to_existing_slug(client, db_session):
    admin = AdminFactory()
    project = ProjectFactory()
    project2 = ProjectFactory(slug = "project")
    token = token_for(admin)
    payload = {
        "title": "Good Project",
        "slug": "project",
        "description": "Desc"
    }

    r = client.put(f"/admin/projects/{project.id}", json = payload, headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Slug already exists"

def test_admin_can_delete_project(client, db_session):
    admin = AdminFactory()
    project = ProjectFactory()
    token = token_for(admin)

    r = client.delete(f"/admin/projects/{project.id}", headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 200, r.text
    assert r.json()["message"] == "Deleted"

def test_admin_cannot_delete_missing_project(client, db_session):
    admin = AdminFactory()
    token = token_for(admin)

    r = client.delete("/admin/projects/9999", headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Project not found"