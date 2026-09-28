# CampusFlow AI Architecture Specification

## 1. System Architecture Overview

```mermaid
graph TD
    User([Student / Judge]) -->|Voice / Text| Frontend[Next.js Modern Web App]
    Frontend -->|Simulated Alexa+ Layer| AlexaAdapter[AlexaSimulationAdapter]
    AlexaAdapter -->|REST / SSE| BackendAPI[FastAPI Backend /api]
    BackendAPI --> SafetyGuard[Agent Safety & Guardrails]
    SafetyGuard --> Orchestrator[Agent Orchestrator]
    Orchestrator --> BedrockClient[Amazon Bedrock Runtime / Claude 3.5 Sonnet]
    Orchestrator --> MCPClient[MCP Client]
    
    subgraph "Model Context Protocol (Streamable HTTP)"
        MCPClient -->|SSE / JSON-RPC 2.0| MCPServer[CampusFlow MCP Server :8001]
        MCPServer --> ToolRegistry[Tool Registry]
        ToolRegistry --> StudentTools[Student Tools]
        ToolRegistry --> AcademicTools[Academic Tools]
        ToolRegistry --> KnowledgeTools[Knowledge / RAG Tools]
        ToolRegistry --> ActionTools[Action Tools]
        ToolRegistry --> UtilityTools[Utility Tools]
    end

    subgraph "Data & Knowledge Layer"
        AcademicTools --> DBRepo[Repository Layer]
        KnowledgeTools --> RAGEngine[RAG Retriever]
        RAGEngine --> S3_KB[(Amazon S3 & Bedrock KB / Documents)]
        DBRepo --> DynamoDB[(Amazon DynamoDB / SQLite Local)]
    end
```

## 2. Component Details

### A. Frontend Layer
- **Framework**: Next.js 15+ App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Alexa+ Simulated Interface**: Real-time microphone audio capture using the Web Speech API with automatic state management (`IDLE -> LISTENING -> TRANSCRIBING -> THINKING -> CALLING TOOLS -> RESPONDING -> COMPLETE`).
- **Observability**: Live tool activity feed displaying tool name, latency in milliseconds, status, and parameters.

### B. Agent Orchestrator
- Implements the agent reasoning loop:
  `GOAL -> CONTEXT -> REASONING -> MCP TOOLS -> ACTION -> CONFIRMATION`
- Grounded citations: Links responses directly to institutional circulars and syllabi.
- Proactive intelligence: Monitors attendance drops below 75% and unsubmitted assignments.

### C. MCP Server (Streamable HTTP)
- Listens on `http://127.0.0.1:8001`.
- Provides Server-Sent Events `/sse` for event streaming.
- Handles standard JSON-RPC 2.0 requests over `/messages`.
- Implements 18 validated tools across Student, Academic, Knowledge, Action, and Utility domains.

### D. Security & Guardrail Layer
- Enforces user tenant isolation.
- Defends against system prompt injection and credential dump attacks.
- Sanitizes incoming documents to prevent prompt hijacking.
