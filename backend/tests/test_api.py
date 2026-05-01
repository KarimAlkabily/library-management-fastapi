import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import Base
from app.models.user import User
from app.services import book_service
from app.utils import jwt
from app.utils.security import hash_password


class FakeRedis:
    def __init__(self):
        self._store = {}

    def get(self, key):
        return self._store.get(key)

    def set(self, key, value, ex=None):
        self._store[key] = value
        return True

    def delete(self, key):
        self._store.pop(key, None)
        return True


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)

    book_service.SessionLocal = TestingSessionLocal
    jwt.SessionLocal = TestingSessionLocal
    book_service.redis_client = FakeRedis()

    with TestClient(app) as test_client:
        yield test_client, TestingSessionLocal

    Base.metadata.drop_all(bind=engine)


def _register_user(client, username, email, password):
    return client.post(
        "/register",
        json={"username": username, "email": email, "password": password},
    )


def _login(client, email, password):
    return client.post("/login", json={"email": email, "password": password})


def _create_admin_user(test_db_session):
    db = test_db_session()
    admin = User(
        username="admin",
        email="admin@example.com",
        password=hash_password("admin123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    db.close()


def test_register_login_and_token_validation(client):
    test_client, _ = client

    register_response = _register_user(
        test_client,
        username="member1",
        email="member1@example.com",
        password="pass123",
    )
    assert register_response.status_code == 200
    register_data = register_response.json()
    assert "password" not in register_data
    assert register_data["email"] == "member1@example.com"

    login_response = _login(test_client, "member1@example.com", "pass123")
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    history_response = test_client.get(
        "/history",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert history_response.status_code == 200

    invalid_token_response = test_client.get(
        "/history",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert invalid_token_response.status_code == 401


def test_unauthorized_and_forbidden_access_to_admin_routes(client):
    test_client, _ = client

    no_auth_response = test_client.post(
        "/books",
        json={"title": "Clean Code", "author": "Robert C. Martin"},
    )
    assert no_auth_response.status_code in (401, 403)

    _register_user(
        test_client,
        username="member2",
        email="member2@example.com",
        password="pass123",
    )
    member_login = _login(test_client, "member2@example.com", "pass123")
    member_token = member_login.json()["access_token"]

    forbidden_response = test_client.post(
        "/books",
        json={"title": "DDD", "author": "Eric Evans"},
        headers={"Authorization": f"Bearer {member_token}"},
    )
    assert forbidden_response.status_code == 403


def test_books_crud_with_admin_token(client):
    test_client, testing_session = client
    _create_admin_user(testing_session)
    admin_login = _login(test_client, "admin@example.com", "admin123")
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    create_response = test_client.post(
        "/books",
        json={"title": "Book 1", "author": "Author 1"},
        headers=headers,
    )
    assert create_response.status_code == 200
    created_book_id = create_response.json()["id"]

    all_books_response = test_client.get("/books")
    assert all_books_response.status_code == 200
    assert len(all_books_response.json()) == 1

    single_book_response = test_client.get(f"/books/{created_book_id}")
    assert single_book_response.status_code == 200
    assert single_book_response.json()["title"] == "Book 1"

    update_response = test_client.put(
        f"/books/{created_book_id}",
        json={"title": "Updated Book", "author": "Updated Author"},
        headers=headers,
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Book"

    delete_response = test_client.delete(f"/books/{created_book_id}", headers=headers)
    assert delete_response.status_code == 200

    not_found_after_delete = test_client.get(f"/books/{created_book_id}")
    assert not_found_after_delete.status_code == 404


def test_borrow_limit_and_unavailable_book(client):
    test_client, testing_session = client
    _create_admin_user(testing_session)
    admin_token = _login(test_client, "admin@example.com", "admin123").json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    for idx in range(1, 5):
        create_book_response = test_client.post(
            "/books",
            json={"title": f"Book {idx}", "author": f"Author {idx}"},
            headers=admin_headers,
        )
        assert create_book_response.status_code == 200

    _register_user(test_client, "member3", "member3@example.com", "pass123")
    member_token = _login(test_client, "member3@example.com", "pass123").json()["access_token"]
    member_headers = {"Authorization": f"Bearer {member_token}"}

    assert test_client.post("/borrow", params={"book_id": 1}, headers=member_headers).status_code == 200
    assert test_client.post("/borrow", params={"book_id": 2}, headers=member_headers).status_code == 200
    assert test_client.post("/borrow", params={"book_id": 3}, headers=member_headers).status_code == 200

    limit_response = test_client.post("/borrow", params={"book_id": 4}, headers=member_headers)
    assert limit_response.status_code == 400
    assert limit_response.json()["detail"] == "Borrow limit exceeded"

    _register_user(test_client, "member4", "member4@example.com", "pass123")
    member2_token = _login(test_client, "member4@example.com", "pass123").json()["access_token"]
    member2_headers = {"Authorization": f"Bearer {member2_token}"}

    unavailable_response = test_client.post("/borrow", params={"book_id": 1}, headers=member2_headers)
    assert unavailable_response.status_code == 400
    assert unavailable_response.json()["detail"] == "Book already borrowed"


def test_return_book_requires_token(client):
    test_client, _ = client
    response = test_client.post("/borrow/return", params={"book_id": 1})
    assert response.status_code in (401, 403)
