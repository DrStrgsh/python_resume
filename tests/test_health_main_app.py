def test_main_health_returns_200(client, db_session):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"