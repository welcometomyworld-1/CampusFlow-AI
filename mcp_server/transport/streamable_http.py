import json
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from starlette.responses import StreamingResponse

class StreamableHTTPTransport:
    """
    Streamable HTTP Transport for MCP.
    Implements Server-Sent Events (SSE) streaming session lifecycle
    and chunked JSON-RPC response streaming.
    """
    def __init__(self):
        self.active_sessions: Dict[str, asyncio.Queue] = {}

    async def create_session(self, session_id: str) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.active_sessions[session_id] = queue
        return queue

    def close_session(self, session_id: str):
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]

    async def event_generator(self, session_id: str, queue: asyncio.Queue) -> AsyncGenerator[str, None]:
        # Send initial endpoint event per MCP specification
        endpoint_event = {
            "event": "endpoint",
            "data": f"/messages?session_id={session_id}"
        }
        yield f"event: endpoint\ndata: /messages?session_id={session_id}\n\n"

        try:
            while True:
                data = await queue.get()
                if data is None:
                    break
                event_name = data.get("event", "message")
                payload = json.dumps(data.get("data", {}))
                yield f"event: {event_name}\ndata: {payload}\n\n"
        except asyncio.CancelledError:
            self.close_session(session_id)

    async def send_message(self, session_id: str, message: Dict[str, Any]):
        if session_id in self.active_sessions:
            await self.active_sessions[session_id].put({
                "event": "message",
                "data": message
            })

_streamable_transport = None
def get_streamable_transport() -> StreamableHTTPTransport:
    global _streamable_transport
    if _streamable_transport is None:
        _streamable_transport = StreamableHTTPTransport()
    return _streamable_transport
