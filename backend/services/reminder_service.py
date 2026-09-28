import uuid
from typing import List, Optional
from datetime import datetime
from backend.repositories import get_repository
from backend.models.models import ReminderModel

class ReminderService:
    def __init__(self):
        self.repo = get_repository()

    def create_reminder(
        self,
        student_id: str,
        title: str,
        date: str = "2026-09-27",
        time: str = "19:00",
        reminder_type: str = "study"
    ) -> ReminderModel:
        reminder = ReminderModel(
            id=f"rem_{uuid.uuid4().hex[:8]}",
            student_id=student_id,
            title=title,
            date=date,
            time=time,
            type=reminder_type,
            status="active",
            created_by="agent",
            created_at=datetime.utcnow().isoformat()
        )
        return self.repo.create_reminder(reminder)

    def get_student_reminders(self, student_id: str) -> List[ReminderModel]:
        return self.repo.get_reminders(student_id)

_reminder_service = None
def get_reminder_service() -> ReminderService:
    global _reminder_service
    if _reminder_service is None:
        _reminder_service = ReminderService()
    return _reminder_service
