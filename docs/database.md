# CampusFlow AI — Database Schema & Data Models

## 1. Overview
CampusFlow AI utilizes a repository abstraction (`BaseRepository`) with two concrete implementations:
1. **SQLiteRepository** (`campusflow.db`): Zero-dependency local persistence for rapid development, testing, and offline hackathon demos.
2. **DynamoDBRepository**: Production AWS cloud database adapter utilizing Amazon DynamoDB tables with partition keys on `student_id`.

---

## 2. Table Schemas

### `students`
- `id` (PK, string)
- `email` (unique string)
- `password_hash` (string)
- `name` (string)
- `student_id` (string, e.g., "STU1001")
- `university` (string)
- `course` (string)
- `semester` (integer)
- `subjects` (JSON array of strings)
- `preferred_study_time` (string: "morning" | "evening")
- `timezone` (string)
- `notification_preferences` (JSON object)
- `created_at` (ISO timestamp)

### `exams`
- `id` (PK, string)
- `student_id` (FK, string)
- `subject_code` (string)
- `subject_name` (string)
- `date` (YYYY-MM-DD)
- `time` (HH:MM)
- `duration_minutes` (integer)
- `room` (string, e.g. "Room B-204")
- `total_marks` (integer)
- `status` (string)
- `syllabus_topics` (JSON array of strings)

### `assignments`
- `id` (PK, string)
- `student_id` (FK, string)
- `subject_code` (string)
- `subject_name` (string)
- `title` (string)
- `description` (text)
- `due_date` (YYYY-MM-DD)
- `due_time` (HH:MM)
- `status` (pending | submitted | graded)
- `priority` (low | medium | high | urgent)

### `attendance`
- `id` (PK, string)
- `student_id` (FK, string)
- `subject_code` (string)
- `subject_name` (string)
- `attended` (integer)
- `total` (integer)
- `percentage` (float)
- `warning_status` (boolean, true if &lt; 75%)
- `policy_minimum` (float, default 75.0)

### `timetable`
- `id` (PK, string)
- `student_id` (FK, string)
- `day_of_week` (Monday, Tuesday, etc.)
- `subject_code` (string)
- `subject_name` (string)
- `start_time` (HH:MM)
- `end_time` (HH:MM)
- `room` (string)
- `faculty` (string)

### `tasks`
- `id` (PK, string)
- `student_id` (FK, string)
- `title` (string)
- `description` (text)
- `due_date` (YYYY-MM-DD)
- `priority` (low | medium | high | urgent)
- `status` (pending | completed)
- `created_by` (user | agent)
- `created_at` (ISO timestamp)

### `reminders`
- `id` (PK, string)
- `student_id` (FK, string)
- `title` (string)
- `date` (YYYY-MM-DD)
- `time` (HH:MM)
- `type` (study | exam | assignment | one_time)
- `status` (active | dismissed)
- `created_by` (agent | user)
- `created_at` (ISO timestamp)

### `study_plans`
- `id` (PK, string)
- `student_id` (FK, string)
- `subject` (string)
- `exam_date` (YYYY-MM-DD)
- `target_hours` (float)
- `items` (JSON array: topic, start_time, end_time, duration_minutes, priority, reason)
- `why_explanation` (text)
- `status` (active | archived)
- `created_at` (ISO timestamp)

### `notices`
- `id` (PK, string)
- `title` (string)
- `category` (exam | academic | administrative)
- `date_posted` (YYYY-MM-DD)
- `urgency` (high | normal | low)
- `summary` (text)
- `content` (text)
- `official_ref` (string, e.g. "ATU/COE/FALL2026/NOT-092")
- `source_document` (string)

### `tool_execution_logs`
- `id` (PK, string)
- `session_id` (string)
- `student_id` (string)
- `tool_name` (string)
- `parameters` (JSON object)
- `result` (JSON object)
- `status` (success | error | unauthorized)
- `duration_ms` (float)
- `timestamp` (ISO timestamp)
