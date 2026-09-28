import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.repositories.sqlite_repository import SQLiteRepository

def seed():
    print("Initializing CampusFlow AI Database & Seeding Demo Student...")
    repo = SQLiteRepository()
    repo.reset_demo_data()
    student = repo.get_student_by_email("aarav.kumar@apex-university.edu")
    if student:
        print(f"Successfully seeded: {student.name} ({student.student_id})")
        print(f"Enrolled Course: {student.course}")
        print("Demo data initialized successfully!")
    else:
        print("Error: Student not created.")

if __name__ == "__main__":
    seed()
