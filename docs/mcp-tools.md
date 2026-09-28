# CampusFlow AI — MCP Tool Specification

## 1. Overview
The CampusFlow Model Context Protocol (MCP) server provides 18 academic and agent tools over **Streamable HTTP** (Server-Sent Events and JSON-RPC 2.0).
- **Transport**: `http://127.0.0.1:8001/sse` & `http://127.0.0.1:8001/messages`
- **Protocol Specification**: MCP 2024-11-05
- **Tool Listing**: `GET /mcp/tools`
- **Tool Invocation**: `POST /mcp/invoke`

---

## 2. Granular Tool Catalog

### Student Tools
1. `get_student_profile`
   - **Description**: Retrieves student details, enrolled courses, subjects, semester, and study preferences.
   - **Inputs**: `{"student_id": "STU1001"}`
   - **Outputs**: `name`, `student_id`, `university`, `course`, `semester`, `preferred_study_time`, `timezone`.

2. `update_student_preferences`
   - **Description**: Updates study preferences (e.g. morning/evening focus window).
   - **Inputs**: `{"student_id": "STU1001", "preferred_study_time": "evening"}`

### Academic Tools
3. `get_timetable`
   - **Description**: Returns daily/weekly timetable with classroom venues and professors.
   - **Inputs**: `{"student_id": "STU1001", "day_of_week": "Monday"}`

4. `get_exam_schedule`
   - **Description**: Retrieves scheduled examinations, date, time, venue, and high-weightage syllabus topics.
   - **Inputs**: `{"student_id": "STU1001", "date_range": "next_7_days"}`

5. `get_assignments`
   - **Description**: Retrieves assignments with deadline countdown and priority status.
   - **Inputs**: `{"student_id": "STU1001", "status": "pending"}`

6. `get_attendance`
   - **Description**: Computes attended vs total classes and flags low attendance (&lt; 75%) warning.
   - **Inputs**: `{"student_id": "STU1001"}`

7. `get_course_syllabus`
   - **Description**: Returns modules, exam weightages, and core topics for a course code.
   - **Inputs**: `{"subject_code": "CS501"}`

8. `get_learning_progress`
   - **Description**: Returns completed vs pending syllabus topics and exam readiness score.
   - **Inputs**: `{"student_id": "STU1001", "subject_code": "CS501"}`

### Knowledge / RAG Tools
9. `search_college_notices`
   - **Description**: Searches official university notices and urgent circulars (e.g., room reallocations).
   - **Inputs**: `{"query": "DBMS exam room"}`

10. `search_academic_documents`
    - **Description**: Performs document-grounded retrieval across syllabi, calendars, and examination notices with exact official citations.
    - **Inputs**: `{"query": "Room B-204 circular"}`

11. `find_relevant_study_material`
    - **Description**: Locates official textbook chapters and exercises for specified topics.
    - **Inputs**: `{"subject": "DBMS", "topic": "Normalization"}`

### Action Tools
12. `create_task`
    - **Description**: Adds an actionable academic task to the student's task board.
    - **Inputs**: `{"student_id": "STU1001", "title": "Submit CN Assignment", "due_date": "2026-09-28", "priority": "urgent"}`

13. `create_reminder`
    - **Description**: Sets an actionable reminder for study sessions or exam reporting.
    - **Inputs**: `{"student_id": "STU1001", "title": "DBMS Revision", "date": "2026-09-27", "time": "19:00", "reminder_type": "study"}`

14. `create_study_plan`
    - **Description**: Generates and persists a personalized time-blocked study plan prioritized by topic weightage.
    - **Inputs**: `{"student_id": "STU1001", "subject": "DBMS", "exam_date": "2026-09-28", "available_hours": 2.0, "start_time": "19:00"}`

15. `mark_task_complete`
    - **Description**: Marks an existing academic task as completed.
    - **Inputs**: `{"student_id": "STU1001", "task_id": "tsk_1"}`

16. `update_learning_progress`
    - **Description**: Updates student topic mastery status (e.g., mark Normalization completed).
    - **Inputs**: `{"student_id": "STU1001", "subject_code": "CS501", "topic": "Normalization", "status": "completed"}`

### Utility Tools
17. `get_today_summary`
    - **Description**: Aggregates today's lectures, tomorrow's exams, pending assignments, and attendance status in a single tool call.
    - **Inputs**: `{"student_id": "STU1001"}`

18. `get_urgent_items`
    - **Description**: Synthesizes cross-domain high-priority action items and academic alerts.
    - **Inputs**: `{"student_id": "STU1001"}`
