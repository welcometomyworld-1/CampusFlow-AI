import sqlite3
import json
import hashlib
from typing import List, Optional, Dict, Any
from datetime import datetime
from backend.repositories.base_repository import BaseRepository
from backend.models.models import (
    StudentModel, TimetableEntryModel, ExamModel, AssignmentModel,
    AttendanceModel, TaskModel, ReminderModel, StudyPlanModel,
    NoticeModel, DocumentModel, AgentSessionModel, ToolExecutionLogModel
)

def hash_password(password: str) -> str:
    # SHA-256 with fixed salt for demo simplicity and security without external dependency quirks
    salt = "campusflow_salt_2026"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

class SQLiteRepository(BaseRepository):
    def __init__(self, db_path: str = "./campusflow.db"):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password_hash TEXT,
            name TEXT,
            student_id TEXT,
            university TEXT,
            course TEXT,
            semester INTEGER,
            subjects TEXT,
            preferred_study_time TEXT,
            timezone TEXT,
            notification_preferences TEXT,
            created_at TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS timetable (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            day_of_week TEXT,
            subject_code TEXT,
            subject_name TEXT,
            start_time TEXT,
            end_time TEXT,
            room TEXT,
            faculty TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS exams (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            subject_code TEXT,
            subject_name TEXT,
            date TEXT,
            time TEXT,
            duration_minutes INTEGER,
            room TEXT,
            total_marks INTEGER,
            status TEXT,
            syllabus_topics TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS assignments (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            subject_code TEXT,
            subject_name TEXT,
            title TEXT,
            description TEXT,
            due_date TEXT,
            due_time TEXT,
            status TEXT,
            priority TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            subject_code TEXT,
            subject_name TEXT,
            attended INTEGER,
            total INTEGER,
            percentage REAL,
            warning_status INTEGER,
            policy_minimum REAL
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            title TEXT,
            description TEXT,
            due_date TEXT,
            priority TEXT,
            status TEXT,
            created_by TEXT,
            created_at TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS reminders (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            title TEXT,
            date TEXT,
            time TEXT,
            type TEXT,
            status TEXT,
            created_by TEXT,
            created_at TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS study_plans (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            subject TEXT,
            exam_date TEXT,
            target_hours REAL,
            items TEXT,
            why_explanation TEXT,
            status TEXT,
            created_at TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS notices (
            id TEXT PRIMARY KEY,
            title TEXT,
            category TEXT,
            date_posted TEXT,
            urgency TEXT,
            summary TEXT,
            content TEXT,
            official_ref TEXT,
            source_document TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS agent_sessions (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            created_at TEXT,
            messages TEXT,
            tool_calls TEXT,
            actions_taken TEXT,
            summary TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS tool_execution_logs (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            student_id TEXT,
            tool_name TEXT,
            parameters TEXT,
            result TEXT,
            status TEXT,
            duration_ms REAL,
            timestamp TEXT
        )''')

        conn.commit()
        conn.close()

        # Seed if empty
        if not self.get_student_by_email("aarav.kumar@apex-university.edu"):
            self.seed_demo_data()

    def seed_demo_data(self):
        conn = self._get_connection()
        cursor = conn.cursor()

        # Demo student Aarav Kumar
        student = StudentModel(
            id="usr_aarav_1001",
            email="aarav.kumar@apex-university.edu",
            password_hash=hash_password("CampusFlow2026!"),
            name="Aarav Kumar",
            student_id="STU1001",
            university="Apex Technical University",
            course="B.Tech Computer Science & Engineering",
            semester=5,
            subjects=["DBMS", "Operating Systems", "Computer Networks", "Machine Learning", "Software Engineering"],
            preferred_study_time="evening",
            timezone="Asia/Kolkata",
            notification_preferences={"email": True, "push": True, "alexa_announcements": True}
        )

        cursor.execute('''
        INSERT OR REPLACE INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            student.id, student.email, student.password_hash, student.name, student.student_id,
            student.university, student.course, student.semester, json.dumps(student.subjects),
            student.preferred_study_time, student.timezone, json.dumps(student.notification_preferences),
            student.created_at
        ))

        # Timetable (Monday)
        timetable_entries = [
            ("tt_1", student.student_id, "Monday", "CS501", "DBMS Revision Lecture", "09:00", "10:00", "Room B-204", "Dr. Sarah Jenkins"),
            ("tt_2", student.student_id, "Monday", "CS503", "Computer Networks Lab", "11:15", "13:15", "Network Lab 4", "Dr. Gupta"),
            ("tt_3", student.student_id, "Monday", "CS504", "Machine Learning Tutorial", "14:00", "15:00", "Hall C-102", "Dr. Zhang"),
            ("tt_4", student.student_id, "Tuesday", "CS501", "DBMS End-Term Exam", "10:00", "13:00", "Room B-204", "Dr. Sarah Jenkins"),
            ("tt_5", student.student_id, "Wednesday", "CS502", "Operating Systems", "10:00", "11:00", "Hall A-102", "Prof. Harrison")
        ]
        cursor.executemany('INSERT OR REPLACE INTO timetable VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', timetable_entries)

        # Exams
        exams = [
            ("ex_1", student.student_id, "CS501", "Database Management Systems", "2026-09-28", "10:00", 180, "Room B-204", 100, "scheduled", json.dumps(["Normalization", "Transactions", "Indexing"])),
            ("ex_2", student.student_id, "CS502", "Operating Systems", "2026-10-01", "10:00", 180, "Hall A-102", 100, "scheduled", json.dumps(["Process Synchronization", "Virtual Memory", "Deadlocks"])),
            ("ex_3", student.student_id, "CS503", "Computer Networks", "2026-10-04", "10:00", 180, "Hall A-105", 100, "scheduled", json.dumps(["TCP/IP", "Congestion Control", "Routing Protocols"]))
        ]
        cursor.executemany('INSERT OR REPLACE INTO exams VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', exams)

        # Assignments
        assignments = [
            ("as_1", student.student_id, "CS503", "Computer Networks", "Socket Programming & Wireshark Packet Analysis", "Implement multi-threaded client-server TCP chat and packet trace submission.", "2026-09-28", "23:59", "pending", "high"),
            ("as_2", student.student_id, "CS501", "DBMS", "B+ Tree Indexing Simulation in Python", "Demonstrate B+ Tree node splitting and range queries.", "2026-09-30", "17:00", "submitted", "medium"),
            ("as_3", student.student_id, "CS504", "Machine Learning", "SVM & Kernel Ridge Regression", "Implement hyperparameter tuning on student performance dataset.", "2026-10-05", "23:59", "pending", "normal")
        ]
        cursor.executemany('INSERT OR REPLACE INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', assignments)

        # Attendance
        attendance = [
            ("att_1", student.student_id, "CS501", "Database Management Systems", 26, 36, 72.22, 1, 75.0),
            ("att_2", student.student_id, "CS502", "Operating Systems", 32, 38, 84.21, 0, 75.0),
            ("att_3", student.student_id, "CS503", "Computer Networks", 29, 36, 80.56, 0, 75.0),
            ("att_4", student.student_id, "CS504", "Machine Learning", 34, 40, 85.00, 0, 75.0),
            ("att_5", student.student_id, "CS505", "Software Engineering", 28, 35, 80.00, 0, 75.0)
        ]
        cursor.executemany('INSERT OR REPLACE INTO attendance VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', attendance)

        # Notices
        notices = [
            ("not_1", "Urgent Room Reassignment for Fall 2026 Semester Examination — Database Management Systems (CS501)", "exam", "2026-09-26", "high",
             "DBMS exam relocated from Hall A-101 to Room B-204 (Science & Technology Wing) due to emergency HVAC maintenance.",
             "All students appearing for CS501 on September 28, 2026 at 10:00 AM must report directly to Room B-204. Entry into Block A is strictly prohibited. Mandatory biometric reporting begins at 09:30 AM.",
             "ATU/COE/FALL2026/NOT-092", "college_notice_exam_room_update.md"),
            ("not_2", "Computer Networks Assignment 1 Submission Portal Open", "academic", "2026-09-24", "normal",
             "Final portal deadline is September 28, 2026 at 23:59 IST. Late submissions will attract a 10% grade penalty.",
             "The Turnitin similarity index must remain under 15%. Include source code zip and PDF report.",
             "ATU/CSE/2026/ASG-04", "academic_calendar.md"),
            ("not_3", "Strict Attendance Policy Compliance Notice for End-Term Exams", "academic", "2026-09-20", "high",
             "Students with attendance below 75% are subject to debarment under Regulation Clause 4.2.",
             "Students between 70% and 74.9% must submit condonation requests accompanied by verified medical certificates or pre-approved institutional representation.",
             "ATU/REG/ATT-2026-08", "attendance_policy.md")
        ]
        cursor.executemany('INSERT OR REPLACE INTO notices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', notices)

        # Initial Tasks
        tasks = [
            ("tsk_1", student.student_id, "Submit Computer Networks Wireshark Assignment", "Complete TCP packet analysis report and upload before 11:59 PM.", "2026-09-28", "urgent", "pending", "user", datetime.utcnow().isoformat()),
            ("tsk_2", student.student_id, "Revise BCNF & 3NF Lossless Join Decomposition", "Solve textbook exercise problems 14.1 through 14.8.", "2026-09-27", "high", "pending", "user", datetime.utcnow().isoformat())
        ]
        cursor.executemany('INSERT OR REPLACE INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', tasks)

        # Initial Reminder
        reminders = [
            ("rem_1", student.student_id, "DBMS Revision Session (Normalization & Transactions)", "2026-09-27", "19:00", "study", "active", "agent", datetime.utcnow().isoformat())
        ]
        cursor.executemany('INSERT OR REPLACE INTO reminders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', reminders)

        conn.commit()
        conn.close()

    def get_student_by_id(self, student_id: str) -> Optional[StudentModel]:
        conn = self._get_connection()
        row = conn.cursor().execute("SELECT * FROM students WHERE id = ? OR student_id = ?", (student_id, student_id)).fetchone()
        conn.close()
        if not row:
            return None
        return StudentModel(
            id=row["id"], email=row["email"], password_hash=row["password_hash"],
            name=row["name"], student_id=row["student_id"], university=row["university"],
            course=row["course"], semester=row["semester"], subjects=json.loads(row["subjects"]),
            preferred_study_time=row["preferred_study_time"], timezone=row["timezone"],
            notification_preferences=json.loads(row["notification_preferences"]),
            created_at=row["created_at"]
        )

    def get_student_by_email(self, email: str) -> Optional[StudentModel]:
        conn = self._get_connection()
        row = conn.cursor().execute("SELECT * FROM students WHERE email = ?", (email,)).fetchone()
        conn.close()
        if not row:
            return None
        return StudentModel(
            id=row["id"], email=row["email"], password_hash=row["password_hash"],
            name=row["name"], student_id=row["student_id"], university=row["university"],
            course=row["course"], semester=row["semester"], subjects=json.loads(row["subjects"]),
            preferred_study_time=row["preferred_study_time"], timezone=row["timezone"],
            notification_preferences=json.loads(row["notification_preferences"]),
            created_at=row["created_at"]
        )

    def create_student(self, student: StudentModel) -> StudentModel:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            student.id, student.email, student.password_hash, student.name, student.student_id,
            student.university, student.course, student.semester, json.dumps(student.subjects),
            student.preferred_study_time, student.timezone, json.dumps(student.notification_preferences),
            student.created_at
        ))
        conn.commit()
        conn.close()
        return student

    def update_student_preferences(self, student_id: str, prefs: Dict[str, Any]) -> bool:
        student = self.get_student_by_id(student_id)
        if not student:
            return False
        conn = self._get_connection()
        cursor = conn.cursor()
        time_pref = prefs.get("preferred_study_time", student.preferred_study_time)
        tz_pref = prefs.get("timezone", student.timezone)
        notif_pref = json.dumps(prefs.get("notification_preferences", student.notification_preferences))
        cursor.execute('''
        UPDATE students SET preferred_study_time = ?, timezone = ?, notification_preferences = ? WHERE id = ? OR student_id = ?
        ''', (time_pref, tz_pref, notif_pref, student_id, student_id))
        conn.commit()
        conn.close()
        return True

    def get_timetable(self, student_id: str, day_of_week: Optional[str] = None) -> List[TimetableEntryModel]:
        conn = self._get_connection()
        cursor = conn.cursor()
        if day_of_week:
            rows = cursor.execute("SELECT * FROM timetable WHERE student_id = ? AND day_of_week = ?", (student_id, day_of_week)).fetchall()
        else:
            rows = cursor.execute("SELECT * FROM timetable WHERE student_id = ?", (student_id,)).fetchall()
        conn.close()
        return [TimetableEntryModel(**dict(r)) for r in rows]

    def get_exams(self, student_id: str) -> List[ExamModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM exams WHERE student_id = ? ORDER BY date ASC", (student_id,)).fetchall()
        conn.close()
        result = []
        for r in rows:
            data = dict(r)
            data["syllabus_topics"] = json.loads(data["syllabus_topics"]) if data.get("syllabus_topics") else []
            result.append(ExamModel(**data))
        return result

    def get_assignments(self, student_id: str, status: Optional[str] = None) -> List[AssignmentModel]:
        conn = self._get_connection()
        cursor = conn.cursor()
        if status:
            rows = cursor.execute("SELECT * FROM assignments WHERE student_id = ? AND status = ? ORDER BY due_date ASC", (student_id, status)).fetchall()
        else:
            rows = cursor.execute("SELECT * FROM assignments WHERE student_id = ? ORDER BY due_date ASC", (student_id,)).fetchall()
        conn.close()
        return [AssignmentModel(**dict(r)) for r in rows]

    def get_attendance(self, student_id: str) -> List[AttendanceModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM attendance WHERE student_id = ?", (student_id,)).fetchall()
        conn.close()
        result = []
        for r in rows:
            data = dict(r)
            data["warning_status"] = bool(data["warning_status"])
            result.append(AttendanceModel(**data))
        return result

    def get_tasks(self, student_id: str) -> List[TaskModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM tasks WHERE student_id = ? ORDER BY due_date ASC, created_at DESC", (student_id,)).fetchall()
        conn.close()
        return [TaskModel(**dict(r)) for r in rows]

    def create_task(self, task: TaskModel) -> TaskModel:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT OR REPLACE INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            task.id, task.student_id, task.title, task.description, task.due_date,
            task.priority, task.status, task.created_by, task.created_at
        ))
        conn.commit()
        conn.close()
        return task

    def update_task(self, task_id: str, student_id: str, updates: Dict[str, Any]) -> Optional[TaskModel]:
        conn = self._get_connection()
        cursor = conn.cursor()
        row = cursor.execute("SELECT * FROM tasks WHERE id = ? AND student_id = ?", (task_id, student_id)).fetchone()
        if not row:
            conn.close()
            return None
        current = dict(row)
        current.update({k: v for k, v in updates.items() if v is not None})
        cursor.execute('''
        UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND student_id = ?
        ''', (current["title"], current["description"], current["due_date"], current["priority"], current["status"], task_id, student_id))
        conn.commit()
        conn.close()
        return TaskModel(**current)

    def delete_task(self, task_id: str, student_id: str) -> bool:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ? AND student_id = ?", (task_id, student_id))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def get_reminders(self, student_id: str) -> List[ReminderModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM reminders WHERE student_id = ? ORDER BY date ASC, time ASC", (student_id,)).fetchall()
        conn.close()
        return [ReminderModel(**dict(r)) for r in rows]

    def create_reminder(self, reminder: ReminderModel) -> ReminderModel:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT OR REPLACE INTO reminders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            reminder.id, reminder.student_id, reminder.title, reminder.date, reminder.time,
            reminder.type, reminder.status, reminder.created_by, reminder.created_at
        ))
        conn.commit()
        conn.close()
        return reminder

    def get_study_plans(self, student_id: str) -> List[StudyPlanModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM study_plans WHERE student_id = ? ORDER BY created_at DESC", (student_id,)).fetchall()
        conn.close()
        result = []
        for r in rows:
            data = dict(r)
            data["items"] = json.loads(data["items"]) if data.get("items") else []
            result.append(StudyPlanModel(**data))
        return result

    def create_study_plan(self, plan: StudyPlanModel) -> StudyPlanModel:
        conn = self._get_connection()
        items_json = json.dumps([item.dict() if hasattr(item, "dict") else item for item in plan.items])
        conn.cursor().execute('''
        INSERT OR REPLACE INTO study_plans VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            plan.id, plan.student_id, plan.subject, plan.exam_date, plan.target_hours,
            items_json, plan.why_explanation, plan.status, plan.created_at
        ))
        conn.commit()
        conn.close()
        return plan

    def get_notices(self) -> List[NoticeModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute("SELECT * FROM notices ORDER BY date_posted DESC").fetchall()
        conn.close()
        return [NoticeModel(**dict(r)) for r in rows]

    def search_notices(self, query: str) -> List[NoticeModel]:
        conn = self._get_connection()
        q = f"%{query.lower()}%"
        rows = conn.cursor().execute('''
        SELECT * FROM notices WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(summary) LIKE ?
        ''', (q, q, q)).fetchall()
        conn.close()
        return [NoticeModel(**dict(r)) for r in rows]

    def create_notice(self, notice: NoticeModel) -> NoticeModel:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT OR REPLACE INTO notices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            notice.id, notice.title, notice.category, notice.date_posted,
            notice.urgency, notice.summary, notice.content,
            notice.official_ref, notice.source_document
        ))
        conn.commit()
        conn.close()
        return notice

    def delete_notice(self, notice_id: str) -> bool:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM notices WHERE id = ?", (notice_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def create_exam(self, exam: ExamModel) -> ExamModel:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT OR REPLACE INTO exams VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            exam.id, exam.student_id, exam.subject_code, exam.subject_name,
            exam.date, exam.time, exam.duration_minutes, exam.room,
            exam.total_marks, exam.status, json.dumps(exam.syllabus_topics)
        ))
        conn.commit()
        conn.close()
        return exam

    def update_attendance(self, student_id: str, subject_code: str, attended: int, total: int) -> bool:
        conn = self._get_connection()
        cursor = conn.cursor()
        pct = (attended / max(total, 1)) * 100.0
        warning = 1 if pct < 75.0 else 0
        cursor.execute('''
        UPDATE attendance SET attended = ?, total = ?, percentage = ?, warning_status = ? 
        WHERE student_id = ? AND subject_code = ?
        ''', (attended, total, pct, warning, student_id, subject_code))
        updated = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return updated

    def get_admin_stats(self) -> Dict[str, Any]:
        conn = self._get_connection()
        cursor = conn.cursor()
        students_count = cursor.execute("SELECT COUNT(*) FROM students").fetchone()[0]
        exams_count = cursor.execute("SELECT COUNT(*) FROM exams").fetchone()[0]
        notices_count = cursor.execute("SELECT COUNT(*) FROM notices").fetchone()[0]
        tasks_count = cursor.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
        logs_count = cursor.execute("SELECT COUNT(*) FROM tool_execution_logs").fetchone()[0]
        conn.close()
        return {
            "total_students": students_count,
            "total_exams": exams_count,
            "total_notices": notices_count,
            "total_tasks": tasks_count,
            "total_tool_invocations": logs_count
        }

    def log_tool_execution(self, log: ToolExecutionLogModel) -> None:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT INTO tool_execution_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            log.id, log.session_id, log.student_id, log.tool_name,
            json.dumps(log.parameters), json.dumps(log.result), log.status,
            log.duration_ms, log.timestamp
        ))
        conn.commit()
        conn.close()

    def get_tool_execution_logs(self, student_id: str, limit: int = 50) -> List[ToolExecutionLogModel]:
        conn = self._get_connection()
        rows = conn.cursor().execute('''
        SELECT * FROM tool_execution_logs WHERE student_id = ? ORDER BY timestamp DESC LIMIT ?
        ''', (student_id, limit)).fetchall()
        conn.close()
        result = []
        for r in rows:
            data = dict(r)
            data["parameters"] = json.loads(data["parameters"]) if data.get("parameters") else {}
            data["result"] = json.loads(data["result"]) if data.get("result") else {}
            result.append(ToolExecutionLogModel(**data))
        return result

    def save_agent_session(self, session: AgentSessionModel) -> None:
        conn = self._get_connection()
        conn.cursor().execute('''
        INSERT OR REPLACE INTO agent_sessions VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            session.id, session.student_id, session.created_at,
            json.dumps(session.messages), json.dumps(session.tool_calls),
            json.dumps(session.actions_taken), session.summary
        ))
        conn.commit()
        conn.close()

    def get_agent_session(self, session_id: str, student_id: str) -> Optional[AgentSessionModel]:
        conn = self._get_connection()
        row = conn.cursor().execute("SELECT * FROM agent_sessions WHERE id = ? AND student_id = ?", (session_id, student_id)).fetchone()
        conn.close()
        if not row:
            return None
        return AgentSessionModel(
            id=row["id"], student_id=row["student_id"], created_at=row["created_at"],
            messages=json.loads(row["messages"]) if row["messages"] else [],
            tool_calls=json.loads(row["tool_calls"]) if row["tool_calls"] else [],
            actions_taken=json.loads(row["actions_taken"]) if row["actions_taken"] else [],
            summary=row["summary"]
        )

    def reset_demo_data(self) -> None:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM timetable")
        cursor.execute("DELETE FROM exams")
        cursor.execute("DELETE FROM assignments")
        cursor.execute("DELETE FROM attendance")
        cursor.execute("DELETE FROM tasks")
        cursor.execute("DELETE FROM reminders")
        cursor.execute("DELETE FROM study_plans")
        cursor.execute("DELETE FROM notices")
        cursor.execute("DELETE FROM tool_execution_logs")
        cursor.execute("DELETE FROM agent_sessions")
        conn.commit()
        conn.close()
        self.seed_demo_data()
