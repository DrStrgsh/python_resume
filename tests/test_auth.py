from tests.factories import UserFactory

def test_login_and_me(client, db_session):
    user = UserFactory(username = "user")

    r = client.post("/auth/login", data = {"username": "user", "password": "password"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    token = data["access_token"]

    r2 = client.get("/auth/me", headers = {"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200, r.text
    me = r2.json()
    assert me["username"] == "user"
    assert me["role"] == "user"

def test_login_wrong_password_or_username(client, db_session):
    UserFactory(username = "user_two")

    r = client.post("/auth/login", data = {"username": "user_two", "password": "wrong"})
    assert r.status_code == 401, r.text

    r2 = client.post("/auth/login", data = {"username": "user_one", "password": "password"})
    assert r.status_code == 401, r.text