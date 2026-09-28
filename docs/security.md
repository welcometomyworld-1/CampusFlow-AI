# CampusFlow AI — Security Architecture & Guardrails

## 1. Multi-Tenant Student Isolation
CampusFlow AI enforces strict per-student tenancy. A student authenticated as `STU1001` cannot read or modify the records, attendance, tasks, or study plans of `STU9999`.
- **Validation**: Executed at the `AgentSafetyGuard` and `ToolRegistry` level.
- **Audit Logging**: Any cross-student query is logged as `unauthorized` in the `tool_execution_logs` table.

## 2. Prompt Injection Defenses
The `AgentSafetyGuard` intercepts user inputs and document contents before model execution:
- Detects system prompt overriding attempts (*"Ignore all previous instructions..."*).
- Blocks credential dump / key extraction requests.
- Returns a safe, controlled refusal message without leaking any internal stack trace or environment variables.

## 3. Passive Document Sanitization
Documents retrieved via RAG (such as PDF circulars or student uploads) are strictly treated as **untrusted data**, not system instructions. Any embedded prompt manipulation inside documents is sanitized before reaching the model context.

## 4. Secret & Credential Handling
- API keys, AWS credentials, and JWT secrets are stored solely in `.env` and injected via `pydantic-settings`.
- No credentials are ever committed to version control or returned in API responses.
- The `.env.example` template provides clear placeholders for all cloud credentials.
