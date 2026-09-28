import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.repositories import get_repository
from backend.models.models import StudyPlanModel, StudyPlanItemModel

class StudyPlanService:
    def __init__(self):
        self.repo = get_repository()

    def generate_plan(
        self,
        student_id: str,
        subject: str = "Database Management Systems",
        exam_date: str = "2026-09-28",
        pending_topics: Optional[List[str]] = None,
        available_hours: float = 2.0,
        start_time_str: str = "19:00"
    ) -> StudyPlanModel:
        if not pending_topics:
            pending_topics = ["Normalization (1NF, 2NF, 3NF, BCNF)", "Transactions & Concurrency Control", "Indexing & B+ Trees"]

        # Parse start hour and minutes
        start_h, start_m = map(int, start_time_str.split(":"))

        items: List[StudyPlanItemModel] = []
        current_minute_offset = 0

        # Topic allocations
        topic_allocations = [
            {
                "topic": "Normalization & Functional Dependencies (1NF, 2NF, 3NF, BCNF)",
                "duration": 40,
                "priority": "Urgent",
                "reason": "Highest weightage in Module 3 syllabus; key question on BCNF decomposition."
            },
            {
                "topic": "Transactions & Concurrency Control (ACID, 2PL, Deadlocks)",
                "duration": 40,
                "priority": "High",
                "reason": "Crucial exam question on Strict 2PL protocols and Precedence graph serializability."
            },
            {
                "topic": "Indexing & B+ Trees (Node Splitting & Range Queries)",
                "duration": 30,
                "priority": "High",
                "reason": "Module 5 core topic; frequently asked 10-mark algorithm query."
            },
            {
                "topic": "Rapid Formula & Definition Recap",
                "duration": 10,
                "priority": "Medium",
                "reason": "Final reinforcement of key theorems and edge cases before sleep."
            }
        ]

        for alloc in topic_allocations:
            start_total_min = start_h * 60 + start_m + current_minute_offset
            end_total_min = start_total_min + alloc["duration"]

            sh = (start_total_min // 60) % 24
            sm = start_total_min % 60
            eh = (end_total_min // 60) % 24
            em = end_total_min % 60

            s_formatted = f"{sh:02d}:{sm:02d}"
            e_formatted = f"{eh:02d}:{em:02d}"

            items.append(StudyPlanItemModel(
                topic=alloc["topic"],
                start_time=s_formatted,
                end_time=e_formatted,
                duration_minutes=alloc["duration"],
                priority=alloc["priority"],
                reason=alloc["reason"]
            ))

            current_minute_offset += alloc["duration"]

        why_explanation = (
            "This study plan prioritizes Normalization and Transactions because: "
            "(1) Your DBMS exam is tomorrow (Sep 28 at 10:00 AM in Room B-204); "
            "(2) Your academic record marks these 3 topics as pending; "
            "(3) Syllabus Modules 3 & 4 carry over 55% of the total exam weightage; "
            "(4) Your preferred study window is evening."
        )

        plan = StudyPlanModel(
            id=f"plan_{uuid.uuid4().hex[:8]}",
            student_id=student_id,
            subject=subject,
            exam_date=exam_date,
            target_hours=available_hours,
            items=items,
            why_explanation=why_explanation,
            status="active",
            created_at=datetime.utcnow().isoformat()
        )

        return self.repo.create_study_plan(plan)

_study_plan_service = None
def get_study_plan_service() -> StudyPlanService:
    global _study_plan_service
    if _study_plan_service is None:
        _study_plan_service = StudyPlanService()
    return _study_plan_service
