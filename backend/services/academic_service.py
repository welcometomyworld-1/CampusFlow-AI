from typing import List, Dict, Any, Optional
from backend.repositories import get_repository
from backend.models.models import TimetableEntryModel, ExamModel, AssignmentModel, AttendanceModel

class AcademicService:
    def __init__(self):
        self.repo = get_repository()

    def get_today_schedule(self, student_id: str, day_name: str = "Monday") -> List[TimetableEntryModel]:
        return self.repo.get_timetable(student_id, day_name)

    def get_upcoming_exams(self, student_id: str) -> List[ExamModel]:
        return self.repo.get_exams(student_id)

    def get_tomorrow_exam(self, student_id: str, tomorrow_date: str = "2026-09-28") -> Optional[ExamModel]:
        exams = self.repo.get_exams(student_id)
        for ex in exams:
            if ex.date == tomorrow_date:
                return ex
        return None

    def get_pending_assignments(self, student_id: str) -> List[AssignmentModel]:
        return self.repo.get_assignments(student_id, status="pending")

    def get_attendance_report(self, student_id: str) -> List[Dict[str, Any]]:
        records = self.repo.get_attendance(student_id)
        report = []
        for r in records:
            is_low = r.percentage < r.policy_minimum
            report.append({
                "subject_code": r.subject_code,
                "subject_name": r.subject_name,
                "attended": r.attended,
                "total": r.total,
                "percentage": r.percentage,
                "is_low": is_low,
                "classes_needed_for_75": max(0, int(3 * r.total - 4 * r.attended)) if is_low else 0,
                "warning_status": r.warning_status
            })
        return report

    def get_academic_summary(self, student_id: str) -> Dict[str, Any]:
        student = self.repo.get_student_by_id(student_id)
        exams = self.get_upcoming_exams(student_id)
        assignments = self.get_pending_assignments(student_id)
        attendance = self.get_attendance_report(student_id)
        today_classes = self.get_today_schedule(student_id)

        tomorrow_exam = self.get_tomorrow_exam(student_id)

        urgent_count = 0
        if tomorrow_exam:
            urgent_count += 1
        urgent_count += len([a for a in assignments if a.due_date == "2026-09-28"])
        urgent_count += len([att for att in attendance if att["is_low"]])

        return {
            "student_name": student.name if student else "Student",
            "student_id": student.student_id if student else student_id,
            "tomorrow_exam": tomorrow_exam.dict() if tomorrow_exam else None,
            "urgent_items_count": urgent_count,
            "exams_count": len(exams),
            "pending_assignments_count": len(assignments),
            "low_attendance_subjects": [a["subject_name"] for a in attendance if a["is_low"]],
            "classes_today_count": len(today_classes)
        }

_academic_service = None
def get_academic_service() -> AcademicService:
    global _academic_service
    if _academic_service is None:
        _academic_service = AcademicService()
    return _academic_service
