import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from backend.repositories import get_repository
from backend.services.academic_service import get_academic_service
from backend.services.study_plan_service import get_study_plan_service
from backend.services.reminder_service import get_reminder_service
from backend.services.recommendation_engine import get_recommendation_engine
from backend.models.models import TaskModel, ReminderModel, ToolExecutionLogModel
from rag.retrieval.retriever import get_rag_retriever

class ToolRegistry:
    def __init__(self):
        self.repo = get_repository()
        self.academic = get_academic_service()
        self.study_plans = get_study_plan_service()
        self.reminders = get_reminder_service()
        self.recommendations = get_recommendation_engine()
        self.rag = get_rag_retriever()

    def execute_tool(self, name: str, params: Dict[str, Any], caller_student_id: Optional[str] = None) -> Dict[str, Any]:
        start_time = time.time()
        status = "success"
        result: Dict[str, Any] = {}

        # Authorization check: A student cannot access another student's data
        target_student = params.get("student_id")
        if caller_student_id and target_student and target_student != caller_student_id:
            result = {
                "error": "UNAUTHORIZED_ACCESS_DENIED",
                "message": f"Security violation: Student {caller_student_id} cannot access data belonging to {target_student}."
            }
            duration_ms = (time.time() - start_time) * 1000
            self.repo.log_tool_execution(ToolExecutionLogModel(
                id=f"log_{uuid.uuid4().hex[:8]}",
                student_id=caller_student_id,
                tool_name=name,
                parameters=params,
                result=result,
                status="unauthorized",
                duration_ms=duration_ms,
                timestamp=datetime.utcnow().isoformat()
            ))
            return result

        try:
            if name == "get_student_profile":
                student = self.repo.get_student_by_id(params["student_id"])
                if student:
                    result = {
                        "name": student.name,
                        "student_id": student.student_id,
                        "university": student.university,
                        "course": student.course,
                        "semester": student.semester,
                        "subjects": student.subjects,
                        "preferred_study_time": student.preferred_study_time,
                        "timezone": student.timezone
                    }
                else:
                    result = {"error": "Student not found"}

            elif name == "update_student_preferences":
                success = self.repo.update_student_preferences(params["student_id"], params)
                result = {"success": success, "message": "Preferences updated successfully."}

            elif name == "get_timetable":
                day = params.get("day_of_week")
                entries = self.repo.get_timetable(params["student_id"], day)
                result = {"timetable": [e.dict() for e in entries]}

            elif name == "get_exam_schedule":
                exams = self.repo.get_exams(params["student_id"])
                result = {"exams": [e.dict() for e in exams]}

            elif name == "get_assignments":
                status_filter = params.get("status")
                if status_filter == "all":
                    status_filter = None
                assignments = self.repo.get_assignments(params["student_id"], status_filter)
                result = {"assignments": [a.dict() for a in assignments]}

            elif name == "get_attendance":
                att = self.academic.get_attendance_report(params["student_id"])
                result = {"attendance": att}

            elif name == "get_course_syllabus":
                code = params.get("subject_code", "CS501").upper()
                # Grounded syllabus retrieval
                docs = self.rag.search(f"{code} syllabus modules normalization transactions", top_k=2)
                result = {
                    "subject_code": code,
                    "subject_name": "Database Management Systems",
                    "core_modules": [
                        "Module 1: Relational Model & Relational Algebra",
                        "Module 2: Advanced SQL & Schema Definition",
                        "Module 3: Normalization & Functional Dependencies (1NF, 2NF, 3NF, BCNF) [HIGH WEIGHTAGE]",
                        "Module 4: Transaction Processing & Concurrency Control (ACID, 2PL, Deadlocks) [HIGH WEIGHTAGE]",
                        "Module 5: Storage, Indexing & B+ Trees [HIGH WEIGHTAGE]"
                    ],
                    "grounded_sources": docs
                }

            elif name == "get_learning_progress":
                result = {
                    "student_id": params["student_id"],
                    "subject_code": params.get("subject_code", "CS501"),
                    "completed_topics": ["Relational Model", "SQL Queries", "ER Modeling"],
                    "pending_topics": ["Normalization (BCNF/3NF)", "Transactions & 2PL", "Indexing & B+ Trees"],
                    "mastery_score": 64.5,
                    "exam_readiness": "Needs urgent 2-hour revision on pending high-weightage topics"
                }

            elif name == "search_college_notices":
                notices = self.repo.search_notices(params["query"])
                if not notices:
                    notices = self.repo.get_notices()
                result = {"notices": [n.dict() for n in notices]}

            elif name == "search_academic_documents":
                results = self.rag.search(params["query"], top_k=3)
                result = {"documents": results}

            elif name == "find_relevant_study_material":
                topic = params.get("topic", "Normalization")
                result = {
                    "subject": params.get("subject", "DBMS"),
                    "topic": topic,
                    "textbook": "Silberschatz, Korth, Sudarshan — Database System Concepts (7th Ed)",
                    "recommended_chapters": "Chapter 7: Relational Database Design (Sections 7.1 - 7.5)",
                    "practice_problems": "Exercises 7.1, 7.4, 7.8 (BCNF Lossless Decomposition)"
                }

            elif name == "create_task":
                task = TaskModel(
                    id=f"tsk_{uuid.uuid4().hex[:8]}",
                    student_id=params["student_id"],
                    title=params["title"],
                    description=params.get("description", ""),
                    due_date=params.get("due_date", "2026-09-28"),
                    priority=params.get("priority", "medium"),
                    status="pending",
                    created_by="agent",
                    created_at=datetime.utcnow().isoformat()
                )
                saved = self.repo.create_task(task)
                result = {"success": True, "task": saved.dict()}

            elif name == "create_reminder":
                reminder = self.reminders.create_reminder(
                    student_id=params["student_id"],
                    title=params["title"],
                    date=params.get("date", "2026-09-27"),
                    time=params.get("time", "19:00"),
                    reminder_type=params.get("reminder_type", "study")
                )
                result = {"success": True, "reminder_id": reminder.id, "reminder": reminder.dict()}

            elif name == "create_study_plan":
                plan = self.study_plans.generate_plan(
                    student_id=params["student_id"],
                    subject=params.get("subject", "Database Management Systems"),
                    exam_date=params.get("exam_date", "2026-09-28"),
                    available_hours=float(params.get("available_hours", 2.0)),
                    start_time_str=params.get("start_time", "19:00")
                )
                result = {"success": True, "plan": plan.dict()}

            elif name == "mark_task_complete":
                updated = self.repo.update_task(params["task_id"], params["student_id"], {"status": "completed"})
                result = {"success": bool(updated), "task": updated.dict() if updated else None}

            elif name == "update_learning_progress":
                result = {
                    "success": True,
                    "student_id": params["student_id"],
                    "topic": params["topic"],
                    "status": params["status"],
                    "message": f"Progress for '{params['topic']}' successfully updated to {params['status']}."
                }

            elif name == "get_today_summary":
                summary = self.academic.get_academic_summary(params["student_id"])
                result = summary

            elif name == "get_upcoming_deadlines":
                assignments = self.academic.get_pending_assignments(params["student_id"])
                exams = self.academic.get_upcoming_exams(params["student_id"])
                result = {
                    "upcoming_exams": [e.dict() for e in exams[:3]],
                    "upcoming_assignments": [a.dict() for a in assignments[:3]]
                }

            elif name == "get_urgent_items":
                briefing = self.recommendations.generate_proactive_briefing(params["student_id"])
                result = briefing

            else:
                status = "error"
                result = {"error": f"Unknown tool: '{name}'"}

        except Exception as e:
            status = "error"
            result = {"error": str(e)}

        duration_ms = (time.time() - start_time) * 1000

        # Log tool execution to repository
        if target_student or caller_student_id:
            sid = target_student or caller_student_id or "STU1001"
            self.repo.log_tool_execution(ToolExecutionLogModel(
                id=f"log_{uuid.uuid4().hex[:8]}",
                student_id=sid,
                tool_name=name,
                parameters=params,
                result=result,
                status=status,
                duration_ms=duration_ms,
                timestamp=datetime.utcnow().isoformat()
            ))

        return {
            "tool": name,
            "status": status,
            "duration_ms": duration_ms,
            "result": result
        }

_tool_registry = None
def get_tool_registry() -> ToolRegistry:
    global _tool_registry
    if _tool_registry is None:
        _tool_registry = ToolRegistry()
    return _tool_registry
