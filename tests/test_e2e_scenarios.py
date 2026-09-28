from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_scenario_prepare_me_for_tomorrow():
    """Test 1: Hero scenario — Prepare me for tomorrow"""
    res = client.post("/api/agent/chat", json={
        "message": "Prepare me for tomorrow."
    })
    assert res.status_code == 200
    data = res.json()
    response_text = data["response"]

    # Verify academic facts retrieved from tools
    assert "DBMS" in response_text or "Database" in response_text
    assert "10:00" in response_text
    assert "Room B-204" in response_text
    assert "Normalization" in response_text

    # Verify tool execution steps were logged
    tool_names = [step["tool_name"] for step in data["tool_execution_steps"]]
    assert "get_exam_schedule" in tool_names
    assert "get_assignments" in tool_names
    assert "search_college_notices" in tool_names
    assert "create_study_plan" in tool_names

    # Verify action was created
    assert len(data["actions_taken"]) > 0
    assert data["actions_taken"][0]["action_type"] == "study_plan_created"

    # Verify RAG citations
    assert len(data["citations"]) > 0
    assert "ATU/COE/FALL2026/NOT-092" in data["citations"][0]["official_ref"]

    # Verify Explainable AI why explanation
    assert data["why_explanation"] is not None
    assert len(data["why_explanation"]) > 20

def test_scenario_set_reminder():
    """Test 3: Reminder creation"""
    res = client.post("/api/agent/chat", json={
        "message": "Set a reminder for 7 PM"
    })
    assert res.status_code == 200
    data = res.json()
    assert "19:00" in data["response"] or "7" in data["response"]
    assert any(a["action_type"] == "reminder_created" for a in data["actions_taken"])

def test_scenario_exam_room_check():
    """Test 4: Document grounded exam room check"""
    res = client.post("/api/agent/chat", json={
        "message": "Did my exam room change?"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Room B-204" in data["response"]
    assert len(data["citations"]) > 0
