from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str
    student_id: str
    university: str
    course: str
    semester: int

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Student Schemas
class StudentUpdatePreferences(BaseModel):
    preferred_study_time: Optional[str] = None
    timezone: Optional[str] = None
    notification_preferences: Optional[Dict[str, Any]] = None

# Task Schemas
class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    due_date: Optional[str] = None
    priority: str = "medium"

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

# Reminder Schemas
class ReminderCreateRequest(BaseModel):
    title: str
    date: str
    time: str
    type: str = "one_time"

# Study Plan Schemas
class StudyPlanItemCreate(BaseModel):
    topic: str
    start_time: str
    end_time: str
    duration_minutes: int
    priority: str
    reason: str

class StudyPlanCreateRequest(BaseModel):
    subject: str
    exam_date: str
    target_hours: float
    items: List[StudyPlanItemCreate]
    why_explanation: Optional[str] = ""

# Agent Chat Schemas
class AgentChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    voice_input: bool = False
    context_override: Optional[Dict[str, Any]] = None

class ToolExecutionStep(BaseModel):
    tool_name: str
    parameters: Dict[str, Any] = {}
    result: Optional[Dict[str, Any]] = None
    status: str = "completed"
    duration_ms: float = 0.0
    description: Optional[str] = None

class ActionItem(BaseModel):
    action_type: str  # reminder_created, study_plan_created, task_created
    title: str
    details: Dict[str, Any]

class CitationItem(BaseModel):
    source_title: str
    official_ref: Optional[str] = None
    snippet: str
    relevance_score: float

class AgentChatResponse(BaseModel):
    response: str
    session_id: str
    tool_execution_steps: List[ToolExecutionStep] = []
    actions_taken: List[ActionItem] = []
    citations: List[CitationItem] = []
    why_explanation: Optional[str] = None
    proactive_insights: List[str] = []
    suggested_followups: List[str] = []

# Dashboard Response
class DashboardSummaryResponse(BaseModel):
    student: Dict[str, Any]
    urgent_items: List[Dict[str, Any]]
    classes_today: List[Dict[str, Any]]
    exams_upcoming: List[Dict[str, Any]]
    assignments_due: List[Dict[str, Any]]
    attendance_summary: List[Dict[str, Any]]
    recent_notices: List[Dict[str, Any]]
    active_reminders: List[Dict[str, Any]]
    active_tasks: List[Dict[str, Any]]
    latest_study_plan: Optional[Dict[str, Any]] = None
    proactive_recommendation: Optional[Dict[str, Any]] = None
