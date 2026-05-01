from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_monitoring_endpoint_returns_basic_fields():
    client.get("/health")

    response = client.get("/monitoring")
    data = response.json()

    assert response.status_code == 200
    assert "api_request_count" in data
    assert "avg_response_time_ms" in data
    assert "error_count" in data
    assert "system_health_status" in data


def test_monitoring_count_increases_after_requests():
    before = client.get("/monitoring").json()["api_request_count"]

    client.get("/health")
    client.get("/health")

    after = client.get("/monitoring").json()["api_request_count"]
    assert after >= before + 2
