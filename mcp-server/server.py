import uuid
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from mcp-server.schemas.tool_schemas import MCP_TOOL_DEFINITIONS
from mcp-server.tools.tool_registry import get_tool_registry
from mcp-server.transport.streamable_http import get_streamable_transport
from backend.config.settings import settings

app = FastAPI(
    title="CampusFlow AI - MCP Server",
    description="Streamable HTTP MCP Server compliant with MCP 2024-11-05 specification for Alexa+ and Bedrock Agent orchestration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transport = get_streamable_transport()
registry = get_tool_registry()

# Authentication dependency for remote accessibility
def verify_mcp_auth(authorization: Optional[str] = Header(None)):
    if settings.APP_ENV == "production":
        expected_token = f"Bearer {settings.MCP_API_KEY}"
        if not authorization or authorization != expected_token:
            raise HTTPException(status_code=401, detail="Unauthorized: Invalid MCP API Token")
    return True

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CampusFlow MCP Server",
        "transport": "Streamable HTTP (SSE)",
        "model_id": settings.BEDROCK_MODEL_ID,
        "region": settings.AWS_REGION,
        "tools_count": len(MCP_TOOL_DEFINITIONS)
    }

@app.get("/mcp/tools")
def list_tools(auth: bool = Depends(verify_mcp_auth)):
    """Return JSON schemas for all available MCP tools."""
    return {"tools": MCP_TOOL_DEFINITIONS}

@app.post("/mcp/invoke")
def invoke_tool(payload: Dict[str, Any], auth: bool = Depends(verify_mcp_auth)):
    """
    Direct tool invocation endpoint.
    Payload: {"tool": str, "parameters": dict, "student_id": optional[str]}
    """
    tool_name = payload.get("tool")
    params = payload.get("parameters", {})
    caller_student_id = payload.get("student_id")

    if not tool_name:
        raise HTTPException(status_code=400, detail="Missing 'tool' in request payload")

    execution = registry.execute_tool(tool_name, params, caller_student_id)
    return execution

@app.get("/sse")
async def sse_endpoint(request: Request):
    """
    Server-Sent Events endpoint for MCP Streamable HTTP transport.
    Generates a unique session ID and streams JSON-RPC events.
    """
    session_id = str(uuid.uuid4())
    queue = await transport.create_session(session_id)
    
    return StreamingResponse(
        transport.event_generator(session_id, queue),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.post("/messages")
async def handle_mcp_message(request: Request, session_id: Optional[str] = None):
    """
    JSON-RPC 2.0 message handler for MCP Streamable HTTP client.
    Supports: initialize, tools/list, tools/call.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    msg_id = body.get("id")
    method = body.get("method")
    params = body.get("params", {})

    response: Dict[str, Any] = {"jsonrpc": "2.0", "id": msg_id}

    if method == "initialize":
        response["result"] = {
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "tools": {"listChanged": True},
                "prompts": {},
                "resources": {}
            },
            "serverInfo": {
                "name": "CampusFlow-Academic-MCP",
                "version": "1.0.0"
            }
        }
    elif method == "notifications/initialized":
        return JSONResponse({"status": "acknowledged"})
    elif method == "tools/list":
        response["result"] = {"tools": MCP_TOOL_DEFINITIONS}
    elif method == "tools/call":
        tool_name = params.get("name")
        args = params.get("arguments", {})
        execution = registry.execute_tool(tool_name, args)
        if execution["status"] == "success":
            response["result"] = {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(execution["result"], indent=2)
                    }
                ]
            }
        else:
            response["error"] = {
                "code": -32603,
                "message": execution["result"].get("error", "Tool execution failed")
            }
    else:
        response["error"] = {
            "code": -32601,
            "message": f"Method '{method}' not implemented."
        }

    # If connected via active SSE session, send event through stream
    if session_id:
        await transport.send_message(session_id, response)

    return JSONResponse(response)

if __name__ == "__main__":
    uvicorn.run(app, host=settings.MCP_SERVER_HOST, port=settings.MCP_SERVER_PORT)
