from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class StudentModel(BaseModel):
    id: str
    email: str
    password_hash: str
    name: str
    student_id: str
    university: str
    course: str
    semester: int
    subjects: List[str] = []
    preferred_study_time: str = "evening"
    timezone: str = "UTC"
    notification_preferences: Dict[str, Any] = Field(default_factory=lambda: {"email": True, "push": True})
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class CourseModel(BaseModel):
    id: str
    code: str
    title: str
    department: str
    credits: int

class SubjectModel(BaseModel):
    code: str
    name: str
    faculty: str
    total_lectures: int
    syllabus_modules: List[Dict[str, Any]] = []

class TimetableEntryModel(BaseModel):
    id: str
    student_id: str
    day_of_week: str  # Monday, Tuesday, etc.
    subject_code: str
    subject_name: str
    start_time: str   # "10:00"
    end_time: str     # "11:00"
    room: str
    faculty: str

class ExamModel(BaseModel):
    id: str
    student_id: str
    subject_code: str
    subject_name: str
    date: str         # "2026-09-28"
    time: str         # "10:00"
    duration_minutes: int = 180
    room: str         # "Room B-204"
    total_marks: int = 100
    status: str = "scheduled"
    syllabus_topics: List[str] = []

class AssignmentModel(BaseModel):
    id: str
    student_id: str
    subject_code: str
    subject_name: str
    title: str
    description: str
    due_date: str     # "2026-09-28"
    due_time: str     # "23:59"
    status: str = "pending"  # pending, submitted, graded
    priority: str = "high"

class AttendanceModel(BaseModel):
    id: str
    student_id: str
    subject_code: str
    subject_name: str
    attended: int
    total: int
    percentage: float
    warning_status: bool = False
    policy_minimum: float = 75.0

class TaskModel(BaseModel):
    id: str
    student_id: str
    title: str
    description: Optional[str] = ""
    due_date: Optional[str] = None
    priority: str = "medium"  # low, medium, high, urgent
    status: str = "pending"   # pending, completed
    created_by: str = "user"  # user or agent
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ReminderModel(BaseModel):
    id: str
    student_id: str
    title: str
    date: str
    time: str
    type: str = "one_time"    # one_time, recurring, study, exam, assignment
    status: str = "active"    # active, dismissed, sent
    created_by: str = "agent"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class StudyPlanItemModel(BaseModel):
    topic: str
    start_time: str
    end_time: str
    duration_minutes: int
    priority: str
    reason: str

class StudyPlanModel(BaseModel):
    id: str
    student_id: str
    subject: str
    exam_date: str
    target_hours: float
    items: List[StudyPlanItemModel] = []
    why_explanation: str = ""
    status: str = "active"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class NoticeModel(BaseModel):
    id: str
    title: str
    category: str    # exam, academic, administrative, event
    date_posted: str
    urgency: str     # high, normal, low
    summary: str
    content: str
    official_ref: str
    source_document: Optional[str] = None

class DocumentModel(BaseModel):
    id: str
    title: str
    document_type: str  # syllabus, exam_schedule, notice, policy, calendar
    file_path: str
    content: str
    metadata: Dict[str, Any] = {}

class AgentSessionModel(BaseModel):
    id: str
    student_id: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    messages: List[Dict[str, Any]] = []
    tool_calls: List[Dict[str, Any]] = []
    actions_taken: List[Dict[str, Any]] = []
    summary: Optional[str] = None

class ToolExecutionLogModel(BaseModel):
    id: str
    session_id: Optional[str] = None
    student_id: str
    tool_name: str
    parameters: Dict[str, Any]
    result: Dict[str, Any]
    status: str       # success, error
    duration_ms: float
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
