from tests.factories import UserFactory
from tests.jwt_helpers import make_token
from app.models.enums import UserRole

def test_expired_token_returns_401(client, db_session):
    user = UserFactory()
    token = make_token(sub = user.id, role = UserRole.user, exp_delta_seconds = -60)

    r = client.get("/auth/me", headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 401, r.text
    assert r.json()["detail"] == "Invalid token"

def test_invalid_signature_returns_401(client, db_session):
    user = UserFactory()
    token = make_token(sub = user.id, role = UserRole.user, secret = "wrong-secret", exp_delta_seconds = 3600)

    r = client.get("/auth/me", headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 401, r.text
    assert r.json()["detail"] == "Invalid token"

def test_token_for_missing_user_returns_401(client, db_session):
    token = make_token(sub = 99999, role = UserRole.user, exp_delta_seconds = 3600)

    r = client.get("/auth/me", headers = {"Authorization": f"Bearer {token}"})
    assert r.status_code == 401, r.text
    assert r.json()["detail"] == "Invalid token"