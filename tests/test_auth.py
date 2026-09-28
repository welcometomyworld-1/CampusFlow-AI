import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.repositories import get_repository

client = TestClient(app)
repo = get_repository()

def test_login_demo_student():
    response = client.post("/api/auth/login", json={
        "email": "aarav.kumar@apex-university.edu",
        "password": "CampusFlow2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["student_id"] == "STU1001"
    assert data["user"]["name"] == "Aarav Kumar"

def test_invalid_login():
    response = client.post("/api/auth/login", json={
        "email": "aarav.kumar@apex-university.edu",
        "password": "WrongPassword123"
    })
    assert response.status_code == 401

def test_get_me_authenticated():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "aarav.kumar@apex-university.edu",
        "password": "CampusFlow2026!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["student_id"] == "STU1001"
