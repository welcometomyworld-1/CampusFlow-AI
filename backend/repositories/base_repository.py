from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from backend.models.models import (
    StudentModel, TimetableEntryModel, ExamModel, AssignmentModel,
    AttendanceModel, TaskModel, ReminderModel, StudyPlanModel,
    NoticeModel, DocumentModel, AgentSessionModel, ToolExecutionLogModel
)

class BaseRepository(ABC):
    @abstractmethod
    def get_student_by_id(self, student_id: str) -> Optional[StudentModel]:
        pass

    @abstractmethod
    def get_student_by_email(self, email: str) -> Optional[StudentModel]:
        pass

    @abstractmethod
    def create_student(self, student: StudentModel) -> StudentModel:
        pass

    @abstractmethod
    def update_student_preferences(self, student_id: str, prefs: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def get_timetable(self, student_id: str, day_of_week: Optional[str] = None) -> List[TimetableEntryModel]:
        pass

    @abstractmethod
    def get_exams(self, student_id: str) -> List[ExamModel]:
        pass

    @abstractmethod
    def get_assignments(self, student_id: str, status: Optional[str] = None) -> List[AssignmentModel]:
        pass

    @abstractmethod
    def get_attendance(self, student_id: str) -> List[AttendanceModel]:
        pass

    @abstractmethod
    def get_tasks(self, student_id: str) -> List[TaskModel]:
        pass

    @abstractmethod
    def create_task(self, task: TaskModel) -> TaskModel:
        pass

    @abstractmethod
    def update_task(self, task_id: str, student_id: str, updates: Dict[str, Any]) -> Optional[TaskModel]:
        pass

    @abstractmethod
    def delete_task(self, task_id: str, student_id: str) -> bool:
        pass

    @abstractmethod
    def get_reminders(self, student_id: str) -> List[ReminderModel]:
        pass

    @abstractmethod
    def create_reminder(self, reminder: ReminderModel) -> ReminderModel:
        pass

    @abstractmethod
    def get_study_plans(self, student_id: str) -> List[StudyPlanModel]:
        pass

    @abstractmethod
    def create_study_plan(self, plan: StudyPlanModel) -> StudyPlanModel:
        pass

    @abstractmethod
    def get_notices(self) -> List[NoticeModel]:
        pass

    @abstractmethod
    def search_notices(self, query: str) -> List[NoticeModel]:
        pass

    @abstractmethod
    def log_tool_execution(self, log: ToolExecutionLogModel) -> None:
        pass

    @abstractmethod
    def get_tool_execution_logs(self, student_id: str, limit: int = 50) -> List[ToolExecutionLogModel]:
        pass

    @abstractmethod
    def save_agent_session(self, session: AgentSessionModel) -> None:
        pass

    @abstractmethod
    def get_agent_session(self, session_id: str, student_id: str) -> Optional[AgentSessionModel]:
        pass

    @abstractmethod
    def reset_demo_data(self) -> None:
        pass
