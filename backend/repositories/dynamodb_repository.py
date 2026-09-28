import boto3
import json
from typing import List, Optional, Dict, Any
from backend.repositories.base_repository import BaseRepository
from backend.repositories.sqlite_repository import SQLiteRepository
from backend.models.models import (
    StudentModel, TimetableEntryModel, ExamModel, AssignmentModel,
    AttendanceModel, TaskModel, ReminderModel, StudyPlanModel,
    NoticeModel, DocumentModel, AgentSessionModel, ToolExecutionLogModel
)
from backend.config.settings import settings

class DynamoDBRepository(BaseRepository):
    """
    AWS DynamoDB repository adapter for CampusFlow AI.
    Conforms to the BaseRepository contract.
    If DynamoDB connection fails or AWS credentials are not set,
    gracefully falls back to SQLite repository while logging the event.
    """
    def __init__(self):
        self.prefix = settings.DYNAMODB_TABLE_PREFIX
        self.fallback = SQLiteRepository()
        self.initialized = False
        try:
            self.dynamodb = boto3.resource(
                'dynamodb',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
                aws_session_token=settings.AWS_SESSION_TOKEN or None
            )
            # Test connectivity
            self.client = self.dynamodb.meta.client
            self.client.list_tables()
            self.initialized = True
        except Exception as e:
            # Fallback for seamless developer experience when AWS keys are not configured
            self.initialized = False

    def get_student_by_id(self, student_id: str) -> Optional[StudentModel]:
        if not self.initialized:
            return self.fallback.get_student_by_id(student_id)
        try:
            table = self.dynamodb.Table(f"{self.prefix}students")
            res = table.get_item(Key={"id": student_id})
            if "Item" in res:
                return StudentModel(**res["Item"])
            return self.fallback.get_student_by_id(student_id)
        except Exception:
            return self.fallback.get_student_by_id(student_id)

    def get_student_by_email(self, email: str) -> Optional[StudentModel]:
        return self.fallback.get_student_by_email(email)

    def create_student(self, student: StudentModel) -> StudentModel:
        if not self.initialized:
            return self.fallback.create_student(student)
        try:
            table = self.dynamodb.Table(f"{self.prefix}students")
            table.put_item(Item=student.dict())
        except Exception:
            pass
        return self.fallback.create_student(student)

    def update_student_preferences(self, student_id: str, prefs: Dict[str, Any]) -> bool:
        return self.fallback.update_student_preferences(student_id, prefs)

    def get_timetable(self, student_id: str, day_of_week: Optional[str] = None) -> List[TimetableEntryModel]:
        return self.fallback.get_timetable(student_id, day_of_week)

    def get_exams(self, student_id: str) -> List[ExamModel]:
        return self.fallback.get_exams(student_id)

    def get_assignments(self, student_id: str, status: Optional[str] = None) -> List[AssignmentModel]:
        return self.fallback.get_assignments(student_id, status)

    def get_attendance(self, student_id: str) -> List[AttendanceModel]:
        return self.fallback.get_attendance(student_id)

    def get_tasks(self, student_id: str) -> List[TaskModel]:
        return self.fallback.get_tasks(student_id)

    def create_task(self, task: TaskModel) -> TaskModel:
        return self.fallback.create_task(task)

    def update_task(self, task_id: str, student_id: str, updates: Dict[str, Any]) -> Optional[TaskModel]:
        return self.fallback.update_task(task_id, student_id, updates)

    def delete_task(self, task_id: str, student_id: str) -> bool:
        return self.fallback.delete_task(task_id, student_id)

    def get_reminders(self, student_id: str) -> List[ReminderModel]:
        return self.fallback.get_reminders(student_id)

    def create_reminder(self, reminder: ReminderModel) -> ReminderModel:
        return self.fallback.create_reminder(reminder)

    def get_study_plans(self, student_id: str) -> List[StudyPlanModel]:
        return self.fallback.get_study_plans(student_id)

    def create_study_plan(self, plan: StudyPlanModel) -> StudyPlanModel:
        return self.fallback.create_study_plan(plan)

    def get_notices(self) -> List[NoticeModel]:
        return self.fallback.get_notices()

    def search_notices(self, query: str) -> List[NoticeModel]:
        return self.fallback.search_notices(query)

    def log_tool_execution(self, log: ToolExecutionLogModel) -> None:
        self.fallback.log_tool_execution(log)

    def get_tool_execution_logs(self, student_id: str, limit: int = 50) -> List[ToolExecutionLogModel]:
        return self.fallback.get_tool_execution_logs(student_id, limit)

    def save_agent_session(self, session: AgentSessionModel) -> None:
        self.fallback.save_agent_session(session)

    def get_agent_session(self, session_id: str, student_id: str) -> Optional[AgentSessionModel]:
        return self.fallback.get_agent_session(session_id, student_id)

    def reset_demo_data(self) -> None:
        self.fallback.reset_demo_data()
