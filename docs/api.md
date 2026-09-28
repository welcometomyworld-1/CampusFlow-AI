# CampusFlow AI — REST API Documentation

Base URL: `http://127.0.0.1:8000/api`
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## 1. Authentication Endpoints
- `POST /auth/login`: Authenticate student and issue JWT bearer token.
- `POST /auth/signup`: Register new student profile.
- `POST /auth/forgot-password`: Password recovery workflow.
- `POST /auth/reset-password`: Token-verified password reset.
- `GET /auth/me`: Current authenticated student profile.

## 2. Academic Endpoints
- `GET /dashboard`: Aggregated student overview, urgent priorities, upcoming exams, today's classes, attendance summary, and recent circulars.
- `GET /timetable`: Weekly class timetable with optional `?day=Monday` filter.
- `GET /exams`: Fall 2026 end-term examinations with venue assignments.
- `GET /assignments`: Academic assignments with optional `?status=pending` filter.
- `GET /attendance`: Course-by-course attendance percentages and policy threshold alerts.
- `GET /notices`: Official circulars with optional full-text `?query=room` filter.

## 3. Academic Action Endpoints
- `GET /tasks`: List student tasks.
- `POST /tasks`: Create a new academic task.
- `PATCH /tasks/{task_id}`: Update task status or priority.
- `DELETE /tasks/{task_id}`: Remove an academic task.
- `GET /reminders`: List scheduled reminders.
- `POST /reminders`: Schedule a new reminder.
- `GET /study-plans`: List AI-generated study plans.
- `POST /study-plans`: Save a personalized study plan.

## 4. Agent & MCP Endpoints
- `POST /agent/chat`: Conversational endpoint handling multi-step reasoning, tool invocations, RAG citations, and action confirmations.
  - **Request Body**: `{"message": "Prepare me for tomorrow.", "session_id": "sess_1"}`
  - **Response**: `response`, `tool_execution_steps`, `actions_taken`, `citations`, `why_explanation`, `proactive_insights`, `suggested_followups`.
- `GET /agent/activity`: Live telemetry log of recent MCP tool invocations with execution latency.

## 5. Demo Controls
- `POST /admin/reset-demo`: Restores Aarav Kumar's records to pristine demo state.
