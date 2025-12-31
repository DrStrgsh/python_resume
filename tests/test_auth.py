from tests.factories import UserFactory
from tests.jwt_helpers import authenticate_client


def test_login(client, db_session):
    UserFactory.create(username="user")

    r = client.post("/auth/login", data={"username": "user", "password": "password"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["username"] == "user"
    assert data["role"] == "user"


def test_me(client, db_session):
    user = UserFactory.create(username="user")
    authenticate_client(client, user)

    r = client.get("/auth/me")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["username"] == "user"
    assert data["role"] == "user"


def test_login_wrong_password_or_username(client, db_session):
    UserFactory.create(username="user_two")

    r = client.post("/auth/login", data={"username": "user_two", "password": "wrong"})
    assert r.status_code == 401, r.text

    r2 = client.post(
        "/auth/login", data={"username": "user_one", "password": "password"}
    )
    assert r2.status_code == 401, r2.text


def test_logout(client, db_session):
    user = UserFactory.create(username="user")
    authenticate_client(client, user)

    r = client.post("/auth/logout")
    assert r.status_code == 200, r.text
    assert r.json()["ok"]

    set_cookie = r.headers.get("set-cookie")
    assert set_cookie is not None
    assert "access_token=" in set_cookie
    assert ("Max-Age=0" in set_cookie) or ("expires=" in set_cookie.lower())

    client.cookies.clear()
    assert client.get("/auth/me").status_code == 401
