import httpx
from typing import Dict, Any, Optional
from backend.config.settings import settings
from mcp_server.tools.tool_registry import get_tool_registry

class MCPClient:
    """
    Client interface for invoking MCP tools.
    Connects to the CampusFlow Streamable HTTP MCP Server,
    or directly invokes the tool registry locally when running in integrated mode.
    """
    def __init__(self, mcp_url: Optional[str] = None):
        self.mcp_url = mcp_url or settings.MCP_SERVER_URL
        self.registry = get_tool_registry()

    def invoke(self, tool_name: str, parameters: Dict[str, Any], student_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Execute an MCP tool. First tries local direct execution for zero-latency,
        or calls the HTTP MCP server if configured.
        """
        # Execute via the tool registry with timing and authorization tracking
        return self.registry.execute_tool(tool_name, parameters, caller_student_id=student_id)

    async def invoke_async_http(self, tool_name: str, parameters: Dict[str, Any], student_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Remote Streamable HTTP invocation for distributed deployment.
        """
        headers = {
            "Authorization": f"Bearer {settings.MCP_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "tool": tool_name,
            "parameters": parameters,
            "student_id": student_id
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{self.mcp_url}/mcp/invoke", json=payload, headers=headers)
                return res.json()
        except Exception as e:
            # Fallback to local tool registry
            return self.registry.execute_tool(tool_name, parameters, caller_student_id=student_id)
