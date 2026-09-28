# CampusFlow AI — Amazon Developer Hackathon (Alexa+ Track) Alignment

## 1. Executive Alignment Summary
CampusFlow AI is purpose-built to pioneer the new paradigm of **Alexa+**: moving from single-turn voice responses (*"Alexa, what is my timetable?"*) to **multi-turn, autonomous academic action agents** (*"Alexa, prepare me for tomorrow"*).

Traditional voice skills fail students because academic information is fragmented across timetable portals, examination controller notices, LMS assignment dropboxes, and attendance systems. CampusFlow AI unifies these systems through an **MCP-based architecture over Streamable HTTP**, powered by **Amazon Bedrock**.

---

## 2. Track Requirements & Architectural Mapping

| Hackathon Requirement | CampusFlow AI Implementation | Source Verification |
|---|---|---|
| **MCP-based Architecture** | Model Context Protocol implementation exposing 18 granular academic, knowledge, action, and utility tools. | `/mcp_server/server.py`, `/mcp_server/schemas/tool_schemas.py` |
| **Streamable HTTP Transport** | Server-Sent Events (SSE) `/sse` streaming and JSON-RPC 2.0 `/messages` endpoint compliant with MCP specification 2024-11-05. | `/mcp_server/transport/streamable_http.py` |
| **Alexa+ Simulated Experience** | Web-based voice-first Alexa+ interface with speech recognition, speech synthesis, listening/thinking/responding pulses, action confirmation cards, and live tool execution activity. | `/frontend/src/app/assistant/page.tsx`, `/frontend/src/components/AlexaVoiceVisualizer.tsx` |
| **Amazon Bedrock** | Amazon Bedrock Runtime integration with Anthropic Claude 3.5 Sonnet / Llama 3 for goal reasoning, multi-step tool routing, and synthesis. | `/backend/agents/bedrock_client.py`, `/backend/agents/orchestrator.py` |
| **Document Grounding & RAG** | Bedrock Knowledge Bases / Amazon S3 integration with verified citations (e.g., Circular ATU/COE/FALL2026/NOT-092 for room change). Prevents hallucinated deadlines. | `/rag/retrieval/retriever.py`, `/rag/documents/` |
| **AWS DynamoDB & S3** | Repository pattern supporting Amazon DynamoDB for structured student/academic data and Amazon S3 for institutional syllabus and notice PDFs. | `/backend/repositories/dynamodb_repository.py` |
| **Security & Safety** | Prompt injection defenses, cross-student tenant isolation, and protection against indirect document hijacking. | `/backend/agents/safety.py`, `/tests/test_security.py` |
| **Explainable AI** | "Why this recommendation?" expandable panels explaining exact decision drivers (e.g. 72% attendance, exam in 16 hours, 3 incomplete topics). | `/frontend/src/components/WhyThisPanel.tsx` |

---

## 3. AWS Builder Mini Challenge Alignment
CampusFlow AI qualifies for the AWS Builder mini challenge through meaningful, non-decorative use of AWS cloud services:
1. **Amazon Bedrock**: Runs the core reasoning loop, parsing intent from natural speech and determining dynamic tool call plans.
2. **Amazon Bedrock Knowledge Bases & S3**: Stores institutional circulars, attendance policies, and course syllabi with vector indexing.
3. **Amazon DynamoDB**: Stores student profiles, exams, assignments, timetable, and tool execution logs with partition keys on `student_id`.
4. **Amazon Cognito**: Production authentication schema supporting OAuth 2.0 / PKCE and secure token verification.

---

## 4. Why CampusFlow AI Excels in Alexa+ Evaluation
1. **Never Hallucinates Academic Data**: Answers are grounded strictly in MCP tools and verified RAG notices.
2. **Action-First Design**: Does not just give advice; generates time-blocked study plans, creates reminders, and logs tasks.
3. **Transparent Execution**: The **Agent Activity Panel** exposes every tool invocation name, status, and duration in real time.
