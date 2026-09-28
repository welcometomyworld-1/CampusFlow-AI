from fastapi.testclient import TestClient
from mcp_server.server import app
from mcp_server.tools.tool_registry import get_tool_registry

client = TestClient(app)
registry = get_tool_registry()

def test_mcp_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    assert res.json()["transport"] == "Streamable HTTP (SSE)"

def test_mcp_list_tools():
    res = client.get("/mcp/tools")
    assert res.status_code == 200
    tools = res.json()["tools"]
    assert len(tools) >= 15
    tool_names = [t["name"] for t in tools]
    assert "get_exam_schedule" in tool_names
    assert "get_today_summary" in tool_names
    assert "search_college_notices" in tool_names
    assert "create_study_plan" in tool_names
    assert "create_reminder" in tool_names

def test_mcp_tool_execution():
    res = client.post("/mcp/invoke", json={
        "tool": "get_exam_schedule",
        "parameters": {"student_id": "STU1001", "date_range": "next_7_days"}
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert len(data["result"]["exams"]) > 0
    assert data["result"]["exams"][0]["subject_code"] == "CS501"

def test_mcp_json_rpc_call():
    res = client.post("/messages", json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "get_today_summary",
            "arguments": {"student_id": "STU1001"}
        }
    })
    assert res.status_code == 200
    assert "result" in res.json()
