import os
import uuid
from models.study_session import StudySession

class SessionService:
    def __init__(self):
        self.pdf_dir = "data/completed_forms"
        os.makedirs(self.pdf_dir, exist_ok=True)

    def save_pdf(self, pdf_file):
        pdf_filename = f"form_{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(self.pdf_dir, pdf_filename)
        pdf_file.save(pdf_path)
        return pdf_path

    def create_study_session(self, data, files):
        student_id = data.get("student_id")
        if not student_id:
            raise ValueError("student_id is required")
        
        return StudySession(
            student_id=int(student_id),
            date=data.get("date", "").strip(),
            start_time=data.get("start_time", "").strip(),
            end_time=data.get("end_time", "").strip(),
            session_topic=data.get("session_topic", "").strip(),
            pdf_path=self.save_pdf(files["pdf"])
        )