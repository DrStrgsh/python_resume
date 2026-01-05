from tests.factories import AdminFactory, TechnologyFactory, UserFactory
from tests.jwt_helpers import authenticate_client


def test_users_can_get_technologies(client, db_session):
    for _ in range(2):
        TechnologyFactory.create()

    r = client.get("/api/technologies")
    assert r.status_code == 200, r.text
    assert len(r.json()) == 2


def test_users_cannot_create_technologies(client, db_session):
    user = UserFactory.create()
    authenticate_client(client, user)
    payload = {"name": "Technology", "start_year": 2022}

    r = client.post("/api/technologies", json=payload)
    assert r.status_code == 403, r.text


def test_admin_can_create_technologies(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)
    payload = {"name": "Technology", "start_year": 2022}

    r = client.post("/api/technologies", json=payload)
    assert r.status_code in (200, 201), r.text
    assert r.json()["name"] == "Technology"


def test_admin_cannot_create_existing_technologies(client, db_session):
    admin = AdminFactory.create()
    TechnologyFactory(name="Technology")
    authenticate_client(client, admin)
    payload = {"name": "Technology", "start_year": 2022}

    r = client.post("/api/technologies", json=payload)
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Technology already exists"


def test_admin_can_update_technologies(client, db_session):
    admin = AdminFactory.create()
    technology = TechnologyFactory.create()
    authenticate_client(client, admin)
    payload = {"name": "Updated Technology", "start_year": 2022}

    r = client.patch(f"/api/technologies/{technology.id}", json=payload)
    assert r.status_code == 200, r.text
    assert r.json()["name"] == "Updated Technology"


def test_admin_cannot_update_missing_technologies(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)
    payload = {"name": "Updated Technology", "start_year": 2022}

    r = client.patch("/api/technologies/9999", json=payload)
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Technology not found"


def test_admin_cannot_update_technologies_with_existing_name(client, db_session):
    admin = AdminFactory.create()
    TechnologyFactory(name="Technology")
    technology = TechnologyFactory.create()
    authenticate_client(client, admin)
    payload = {"name": "Technology", "start_year": 2022}

    r = client.patch(f"/api/technologies/{technology.id}", json=payload)
    assert r.status_code == 400, r.text
    assert r.json()["detail"] == "Technology already exists"


def test_admin_can_delete_technologies(client, db_session):
    admin = AdminFactory.create()
    technology = TechnologyFactory.create()
    authenticate_client(client, admin)

    r = client.delete(f"/api/technologies/{technology.id}")
    assert r.status_code == 200, r.text
    assert r.json()["message"] == "Deleted"


def test_admin_cannot_delete_missing_technologies(client, db_session):
    admin = AdminFactory.create()
    authenticate_client(client, admin)

    r = client.delete("/api/technologies/9999")
    assert r.status_code == 404, r.text
    assert r.json()["detail"] == "Technology not found"
