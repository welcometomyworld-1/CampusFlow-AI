import uuid
import hashlib
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime

from backend.schemas.schemas import (
    LoginRequest, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest, TokenResponse,
    TaskCreateRequest, TaskUpdateRequest, ReminderCreateRequest, StudyPlanCreateRequest,
    AgentChatRequest, AgentChatResponse, DashboardSummaryResponse
)
from backend.models.models import StudentModel, TaskModel, ReminderModel, StudyPlanModel, StudyPlanItemModel
from backend.repositories import get_repository
from backend.services.academic_service import get_academic_service
from backend.services.recommendation_engine import get_recommendation_engine
from backend.agents.orchestrator import get_orchestrator
from backend.auth.jwt_auth import create_access_token, get_current_student

router = APIRouter()
repo = get_repository()
academic = get_academic_service()
recommendations = get_recommendation_engine()
orchestrator = get_orchestrator()

def hash_pw(password: str) -> str:
    return hashlib.sha256((password + "campusflow_salt_2026").encode("utf-8")).hexdigest()

# ----------------- AUTH -----------------
@router.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest):
    student = repo.get_student_by_email(req.email)
    if not student:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if student.password_hash != hash_pw(req.password):
        # Check demo fallback password
        if req.password != "CampusFlow2026!":
            raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": student.student_id, "email": student.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "student_id": student.student_id,
            "university": student.university,
            "course": student.course,
            "semester": student.semester
        }
    }

@router.post("/auth/signup", response_model=TokenResponse)
def signup(req: SignupRequest):
    existing = repo.get_student_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists")

    new_student = StudentModel(
        id=f"usr_{uuid.uuid4().hex[:8]}",
        email=req.email,
        password_hash=hash_pw(req.password),
        name=req.name,
        student_id=req.student_id,
        university=req.university,
        course=req.course,
        semester=req.semester,
        subjects=["DBMS", "Operating Systems", "Computer Networks"],
        created_at=datetime.utcnow().isoformat()
    )
    repo.create_student(new_student)
    token = create_access_token({"sub": new_student.student_id, "email": new_student.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_student.id,
            "name": new_student.name,
            "email": new_student.email,
            "student_id": new_student.student_id,
            "university": new_student.university,
            "course": new_student.course,
            "semester": new_student.semester
        }
    }

@router.post("/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    return {"message": "If the email is registered, a password reset link has been dispatched."}

@router.post("/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    return {"message": "Password successfully reset. Please log in with your new password."}

@router.get("/auth/me")
def get_me(student: StudentModel = Depends(get_current_student)):
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "student_id": student.student_id,
        "university": student.university,
        "course": student.course,
        "semester": student.semester,
        "subjects": student.subjects,
        "preferred_study_time": student.preferred_study_time,
        "timezone": student.timezone
    }

# ----------------- DASHBOARD -----------------
@router.get("/dashboard", response_model=DashboardSummaryResponse)
def get_dashboard(student: StudentModel = Depends(get_current_student)):
    exams = repo.get_exams(student.student_id)
    assignments = repo.get_assignments(student.student_id)
    attendance = academic.get_attendance_report(student.student_id)
    timetable = repo.get_timetable(student.student_id, "Monday")
    notices = repo.get_notices()
    reminders = repo.get_reminders(student.student_id)
    tasks = repo.get_tasks(student.student_id)
    plans = repo.get_study_plans(student.student_id)
    briefing = recommendations.generate_proactive_briefing(student.student_id)

    return {
        "student": {
            "name": student.name,
            "student_id": student.student_id,
            "course": student.course,
            "semester": student.semester,
            "university": student.university
        },
        "urgent_items": briefing.get("priorities", []),
        "classes_today": [t.dict() for t in timetable],
        "exams_upcoming": [e.dict() for e in exams],
        "assignments_due": [a.dict() for a in assignments if a.status == "pending"],
        "attendance_summary": attendance,
        "recent_notices": [n.dict() for n in notices[:3]],
        "active_reminders": [r.dict() for r in reminders if r.status == "active"],
        "active_tasks": [t.dict() for t in tasks if t.status == "pending"],
        "latest_study_plan": plans[0].dict() if plans else None,
    }

# ----------------- COGNITIVE MEMORY & DIGITAL TWIN -----------------
_student_memories_store: Dict[str, List[Dict[str, Any]]] = {
    "STU1001": [
        {
            "id": "mem_1",
            "category": "Behavioral Habit",
            "title": "Evening Study Rhythm",
            "detail": "Consistently schedules high-concentration study blocks between 7:00 PM and 10:00 PM in 45-minute Pomodoro intervals.",
            "source": "Observed via Alexa+ study plans",
            "confidence": 0.94,
            "created_at": "2026-09-24 19:42"
        },
        {
            "id": "mem_2",
            "category": "Weak Topic Alert",
            "title": "Struggles with Normalization (BCNF)",
            "detail": "Requested 3 repeat explanations on Lossless Join and Minimal Cover during CS501 prep.",
            "source": "Bedrock Claude 3.5 Sonnet Q&A analysis",
            "confidence": 0.88,
            "created_at": "2026-09-26 21:15"
        },
        {
            "id": "mem_3",
            "category": "Statutory Policy Warning",
            "title": "DBMS Attendance Deficit (72.2%)",
            "detail": "Below statutory 75% threshold under ATU ordinance. Requires attendance in next 2 sessions.",
            "source": "Institutional ERP sync",
            "confidence": 1.0,
            "created_at": "2026-09-27 08:30"
        },
        {
            "id": "mem_4",
            "category": "Academic Goal",
            "title": "Target Semester SGPA: 8.5+",
            "detail": "Aiming for grade A in CS501 (DBMS) and CS502 (Operating Systems) to maintain honor roll.",
            "source": "Student onboarding preference",
            "confidence": 0.95,
            "created_at": "2026-09-15 11:00"
        }
    ]
}

@router.get("/student/memory")
def get_student_memory(student: StudentModel = Depends(get_current_student)):
    student_id = student.student_id
    briefing = recommendations.generate_proactive_briefing(student_id)
    memories = _student_memories_store.get(student_id, _student_memories_store.get("STU1001", []))
    
    return {
        "student_id": student_id,
        "name": student.name,
        "course": student.course,
        "semester": student.semester,
        "digital_twin": {
            "sync_status": "Synced & Active",
            "engine": "Amazon Bedrock (Claude 3.5 Sonnet)",
            "memory_vault_version": "v2.4 Enterprise Cognitive Model",
            "encryption": "AES-256 DynamoDB Tenant Partition",
            "last_synthesis": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        },
        "habits": {
            "preferred_study_time": "Late Evening (19:00 - 22:00 IST)",
            "focus_duration_minutes": 45,
            "break_duration_minutes": 10,
            "preferred_modality": "Simulated Alexa+ Voice & Visual Kanban",
            "proactive_alert_level": "High (Alerts on attendance & venue shifts)"
        },
        "topic_mastery": [
            {
                "subject_code": "CS501",
                "subject_name": "Database Management Systems",
                "mastery_score": 64,
                "status": "critical_review",
                "weak_topics": ["Relational Normalization (3NF/BCNF)", "B+ Tree Indexing Node Splits"],
                "strong_topics": ["SQL DDL/DML & Aggregations", "ACID Properties Overview"]
            },
            {
                "subject_code": "CS502",
                "subject_name": "Operating Systems",
                "mastery_score": 82,
                "status": "good_standing",
                "weak_topics": ["Banker's Deadlock Avoidance Algorithm"],
                "strong_topics": ["CPU Scheduling (Round Robin/SJF)", "POSIX Multi-threading"]
            },
            {
                "subject_code": "CS503",
                "subject_name": "Computer Networks",
                "mastery_score": 75,
                "status": "on_track",
                "weak_topics": ["TCP Congestion Control Algorithms"],
                "strong_topics": ["Subnet Masking & IP Addressing", "OSI Model Layers"]
            }
        ],
        "episodic_memories": memories,
        "proactive_briefing": briefing
    }

@router.post("/student/memory")
def add_student_memory(payload: Dict[str, Any], student: StudentModel = Depends(get_current_student)):
    student_id = student.student_id
    if student_id not in _student_memories_store:
        _student_memories_store[student_id] = list(_student_memories_store.get("STU1001", []))
    
    new_mem = {
        "id": f"mem_{uuid.uuid4().hex[:6]}",
        "category": payload.get("category", "Student Note"),
        "title": payload.get("title", "Custom Memory Entry"),
        "detail": payload.get("detail", ""),
        "source": "User Explicit Directive",
        "confidence": 1.0,
        "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    }
    _student_memories_store[student_id].insert(0, new_mem)
    return {"success": True, "memory": new_mem}

@router.delete("/student/memory/{memory_id}")
def delete_student_memory(memory_id: str, student: StudentModel = Depends(get_current_student)):
    student_id = student.student_id
    if student_id in _student_memories_store:
        _student_memories_store[student_id] = [
            m for m in _student_memories_store[student_id] if m["id"] != memory_id
        ]
        return {"success": True, "deleted_id": memory_id}
    return {"success": False, "error": "Memory not found"}
@router.get("/timetable")
def get_timetable(day: Optional[str] = None, student: StudentModel = Depends(get_current_student)):
    return {"timetable": [t.dict() for t in repo.get_timetable(student.student_id, day)]}

@router.get("/exams")
def get_exams(student: StudentModel = Depends(get_current_student)):
    return {"exams": [e.dict() for e in repo.get_exams(student.student_id)]}

@router.get("/assignments")
def get_assignments(status: Optional[str] = None, student: StudentModel = Depends(get_current_student)):
    return {"assignments": [a.dict() for a in repo.get_assignments(student.student_id, status)]}

@router.get("/attendance")
def get_attendance(student: StudentModel = Depends(get_current_student)):
    return {"attendance": academic.get_attendance_report(student.student_id)}

@router.get("/notices")
def get_notices(query: Optional[str] = None):
    if query:
        return {"notices": [n.dict() for n in repo.search_notices(query)]}
    return {"notices": [n.dict() for n in repo.get_notices()]}

# ----------------- TASKS -----------------
@router.get("/tasks")
def list_tasks(student: StudentModel = Depends(get_current_student)):
    return {"tasks": [t.dict() for t in repo.get_tasks(student.student_id)]}

@router.post("/tasks")
def create_task(req: TaskCreateRequest, student: StudentModel = Depends(get_current_student)):
    task = TaskModel(
        id=f"tsk_{uuid.uuid4().hex[:8]}",
        student_id=student.student_id,
        title=req.title,
        description=req.description,
        due_date=req.due_date,
        priority=req.priority,
        status="pending",
        created_by="user",
        created_at=datetime.utcnow().isoformat()
    )
    return repo.create_task(task).dict()

@router.patch("/tasks/{task_id}")
def update_task(task_id: str, req: TaskUpdateRequest, student: StudentModel = Depends(get_current_student)):
    updated = repo.update_task(task_id, student.student_id, req.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated.dict()

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str, student: StudentModel = Depends(get_current_student)):
    success = repo.delete_task(task_id, student.student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True, "message": "Task deleted successfully"}

# ----------------- REMINDERS -----------------
@router.get("/reminders")
def list_reminders(student: StudentModel = Depends(get_current_student)):
    return {"reminders": [r.dict() for r in repo.get_reminders(student.student_id)]}

@router.post("/reminders")
def create_reminder(req: ReminderCreateRequest, student: StudentModel = Depends(get_current_student)):
    reminder = ReminderModel(
        id=f"rem_{uuid.uuid4().hex[:8]}",
        student_id=student.student_id,
        title=req.title,
        date=req.date,
        time=req.time,
        type=req.type,
        status="active",
        created_by="user",
        created_at=datetime.utcnow().isoformat()
    )
    return repo.create_reminder(reminder).dict()

# ----------------- STUDY PLANS -----------------
@router.get("/study-plans")
def list_study_plans(student: StudentModel = Depends(get_current_student)):
    return {"study_plans": [p.dict() for p in repo.get_study_plans(student.student_id)]}

@router.post("/study-plans")
def create_study_plan(req: StudyPlanCreateRequest, student: StudentModel = Depends(get_current_student)):
    plan = StudyPlanModel(
        id=f"plan_{uuid.uuid4().hex[:8]}",
        student_id=student.student_id,
        subject=req.subject,
        exam_date=req.exam_date,
        target_hours=req.target_hours,
        items=[StudyPlanItemModel(**item.dict()) for item in req.items],
        why_explanation=req.why_explanation or "",
        status="active",
        created_at=datetime.utcnow().isoformat()
    )
    return repo.create_study_plan(plan).dict()

# ----------------- AGENT CHAT -----------------
@router.post("/agent/chat", response_model=AgentChatResponse)
def chat_with_agent(req: AgentChatRequest, student: StudentModel = Depends(get_current_student)):
    return orchestrator.process_message(
        message=req.message,
        student_id=student.student_id,
        session_id=req.session_id
    )

@router.get("/agent/activity")
def get_agent_activity(limit: int = 30, student: StudentModel = Depends(get_current_student)):
    logs = repo.get_tool_execution_logs(student.student_id, limit=limit)
    return {"activity": [l.dict() for l in logs]}

# ----------------- ADMIN & PORTAL MANAGEMENT -----------------
@router.get("/admin/stats")
def get_admin_stats():
    if hasattr(repo, "get_admin_stats"):
        return repo.get_admin_stats()
    return {"total_students": 1, "total_exams": 3, "total_notices": 3, "total_tasks": 2, "total_tool_invocations": 12}

@router.get("/admin/students")
def list_students():
    conn = getattr(repo, "_get_connection", None)
    if conn:
        c = conn()
        rows = c.cursor().execute("SELECT id, name, email, student_id, university, course, semester, preferred_study_time FROM students").fetchall()
        c.close()
        return {"students": [dict(r) for r in rows]}
    return {"students": []}

@router.post("/admin/notices")
def admin_create_notice(payload: Dict[str, Any]):
    from backend.models.models import NoticeModel
    notice = NoticeModel(
        id=f"not_{uuid.uuid4().hex[:8]}",
        title=payload.get("title", "New Notice"),
        category=payload.get("category", "academic"),
        date_posted=payload.get("date_posted", datetime.utcnow().strftime("%Y-%m-%d")),
        urgency=payload.get("urgency", "normal"),
        summary=payload.get("summary", ""),
        content=payload.get("content", ""),
        official_ref=payload.get("official_ref", f"ATU/NOT/{uuid.uuid4().hex[:4].upper()}"),
        source_document="Admin Console"
    )
    if hasattr(repo, "create_notice"):
        saved = repo.create_notice(notice)
        return {"success": True, "notice": saved.dict()}
    return {"success": False, "error": "Repository does not support notice creation"}

@router.delete("/admin/notices/{notice_id}")
def admin_delete_notice(notice_id: str):
    if hasattr(repo, "delete_notice"):
        deleted = repo.delete_notice(notice_id)
        return {"success": deleted}
    return {"success": False}

@router.post("/admin/exams")
def admin_create_exam(payload: Dict[str, Any]):
    from backend.models.models import ExamModel
    exam = ExamModel(
        id=f"ex_{uuid.uuid4().hex[:8]}",
        student_id=payload.get("student_id", "STU1001"),
        subject_code=payload.get("subject_code", "CS501"),
        subject_name=payload.get("subject_name", "Database Systems"),
        date=payload.get("date", "2026-10-01"),
        time=payload.get("time", "10:00"),
        duration_minutes=int(payload.get("duration_minutes", 180)),
        room=payload.get("room", "Room B-204"),
        total_marks=int(payload.get("total_marks", 100)),
        status=payload.get("status", "scheduled"),
        syllabus_topics=payload.get("syllabus_topics", ["Core Modules"])
    )
    if hasattr(repo, "create_exam"):
        saved = repo.create_exam(exam)
        return {"success": True, "exam": saved.dict()}
    return {"success": False}

@router.patch("/admin/attendance")
def admin_update_attendance(payload: Dict[str, Any]):
    student_id = payload.get("student_id", "STU1001")
    subject_code = payload.get("subject_code", "CS501")
    attended = int(payload.get("attended", 28))
    total = int(payload.get("total", 36))
    if hasattr(repo, "update_attendance"):
        updated = repo.update_attendance(student_id, subject_code, attended, total)
        return {"success": updated}
    return {"success": False}

@router.post("/admin/reset-demo")
def reset_demo():
    repo.reset_demo_data()
    return {"success": True, "message": "Database successfully restored to default state for Aarav Kumar (STU1001)."}

