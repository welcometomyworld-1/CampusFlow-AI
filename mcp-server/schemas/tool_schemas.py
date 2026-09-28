from typing import Dict, Any, List

MCP_TOOL_DEFINITIONS: List[Dict[str, Any]] = [
    # Student Tools
    {
        "name": "get_student_profile",
        "description": "Retrieve the authenticated student's profile, enrolled courses, subjects, semester, and study preferences.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID (e.g., STU1001)"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "update_student_preferences",
        "description": "Update student study preferences such as preferred study time (morning/evening) or timezone.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "preferred_study_time": {"type": "string", "enum": ["morning", "afternoon", "evening", "night"]},
                "timezone": {"type": "string"}
            },
            "required": ["student_id"]
        }
    },
    # Academic Tools
    {
        "name": "get_timetable",
        "description": "Retrieve the student's weekly or daily class schedule, timings, classrooms, and instructors.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "day_of_week": {"type": "string", "description": "Day of week (Monday, Tuesday, etc.) or omit for full week"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_exam_schedule",
        "description": "Retrieve scheduled end-term or midterm examinations, subjects, dates, room numbers, and syllabus topics.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "date_range": {"type": "string", "description": "e.g., 'tomorrow', 'next_7_days', 'all'"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_assignments",
        "description": "Retrieve active or completed assignments, descriptions, deadlines, and urgency priorities.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "status": {"type": "string", "enum": ["all", "pending", "submitted", "graded"]}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_attendance",
        "description": "Retrieve course-by-course attendance percentages, attended vs total classes, and policy threshold alerts.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_course_syllabus",
        "description": "Retrieve detailed syllabus modules, high-weightage topics, and exam focus areas for a subject.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject_code": {"type": "string", "description": "e.g., 'CS501' or 'DBMS'"}
            },
            "required": ["subject_code"]
        }
    },
    {
        "name": "get_learning_progress",
        "description": "Retrieve student topic completion status, pending syllabus topics, and mastery level for upcoming exams.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "subject_code": {"type": "string", "description": "Subject code (e.g., CS501)"}
            },
            "required": ["student_id", "subject_code"]
        }
    },
    # Knowledge / RAG Tools
    {
        "name": "search_college_notices",
        "description": "Search official university notices and circulars for exam room reallocations, deadlines, and urgent policies.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search keyword or topic, e.g. 'DBMS exam room' or 'attendance'"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "search_academic_documents",
        "description": "Search institutional RAG documents (syllabus, exam schedules, academic calendar, policies) with exact citations.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Natural language query to search documents"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "find_relevant_study_material",
        "description": "Locate official textbook chapters and reference materials for specified syllabus topics.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject": {"type": "string", "description": "Subject name"},
                "topic": {"type": "string", "description": "Topic name (e.g. Normalization)"}
            },
            "required": ["subject", "topic"]
        }
    },
    # Action Tools
    {
        "name": "create_task",
        "description": "Create a new academic or study task on the student's task board.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "title": {"type": "string", "description": "Task title"},
                "description": {"type": "string", "description": "Task description"},
                "due_date": {"type": "string", "description": "YYYY-MM-DD format"},
                "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]}
            },
            "required": ["student_id", "title"]
        }
    },
    {
        "name": "create_reminder",
        "description": "Set an actionable reminder for a study session, exam prep, or assignment deadline.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "title": {"type": "string", "description": "Reminder title"},
                "date": {"type": "string", "description": "YYYY-MM-DD"},
                "time": {"type": "string", "description": "HH:MM (24-hour format, e.g. 19:00)"},
                "reminder_type": {"type": "string", "enum": ["study", "exam", "assignment", "one_time"]}
            },
            "required": ["student_id", "title", "date", "time"]
        }
    },
    {
        "name": "create_study_plan",
        "description": "Generate and save a personalized, time-blocked study plan prioritized by syllabus weightage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "subject": {"type": "string", "description": "Subject name"},
                "exam_date": {"type": "string", "description": "Exam date YYYY-MM-DD"},
                "available_hours": {"type": "number", "description": "Available study hours tonight"},
                "start_time": {"type": "string", "description": "Start time e.g. 19:00"}
            },
            "required": ["student_id", "subject", "exam_date"]
        }
    },
    {
        "name": "mark_task_complete",
        "description": "Mark an existing academic task as completed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "task_id": {"type": "string", "description": "Task ID to complete"}
            },
            "required": ["student_id", "task_id"]
        }
    },
    {
        "name": "update_learning_progress",
        "description": "Update mastery status of a syllabus topic (e.g., mark Normalization as completed).",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "subject_code": {"type": "string", "description": "Subject code"},
                "topic": {"type": "string", "description": "Topic name"},
                "status": {"type": "string", "enum": ["in_progress", "completed", "needs_revision"]}
            },
            "required": ["student_id", "subject_code", "topic", "status"]
        }
    },
    # Utility Tools
    {
        "name": "get_today_summary",
        "description": "Retrieve comprehensive synthesis of today's schedule, tomorrow's exams, pending assignments, and attendance status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_upcoming_deadlines",
        "description": "Retrieve all upcoming academic deadlines within the next N days.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"},
                "days": {"type": "integer", "description": "Number of days ahead (default 7)"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_urgent_items",
        "description": "Retrieve highest-priority academic action items requiring student decision or preparation today.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID"}
            },
            "required": ["student_id"]
        }
    }
]
