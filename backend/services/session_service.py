import os
import uuid
from models.study_session import StudySession
from models.student import Student
from datetime import datetime

class SessionService:
    def __init__(self):
        self.pdf_dir = "data/completed_forms"
        os.makedirs(self.pdf_dir, exist_ok=True)

    def save_pdf(self, pdf_file, student_id, date):
        # Get student information
        student = Student.query.get(student_id)
        if not student:
            # Fallback to UUID if student not found
            pdf_filename = f"form_{uuid.uuid4().hex}.pdf"
        else:
            # Clean the names for filename (remove special characters)
            first_name = self._clean_filename(student.first_name)
            last_name = self._clean_filename(student.last_name)
            
            # Format date from YYYY-MM-DD to DDMMYYYY
            try:
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                formatted_date = date_obj.strftime('%d%m%Y')
            except ValueError:
                # Fallback to original date if parsing fails
                formatted_date = date.replace('-', '')
            
            pdf_filename = f"{first_name}_{last_name}_{formatted_date}.pdf"
        
        pdf_path = os.path.join(self.pdf_dir, pdf_filename)
        
        # Handle duplicate filenames by adding a counter
        counter = 1
        original_filename = pdf_filename
        while os.path.exists(pdf_path):
            name_without_ext = original_filename.replace('.pdf', '')
            pdf_filename = f"{name_without_ext}_{counter}.pdf"
            pdf_path = os.path.join(self.pdf_dir, pdf_filename)
            counter += 1
        
        pdf_file.save(pdf_path)
        return pdf_path

    def _clean_filename(self, name):
        """Clean name for use in filename by removing special characters"""
        if not name:
            return "Unknown"
        
        # Replace common special characters and spaces
        cleaned = name.replace(' ', '_')
        cleaned = cleaned.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue')
        cleaned = cleaned.replace('Ä', 'Ae').replace('Ö', 'Oe').replace('Ü', 'Ue')
        cleaned = cleaned.replace('ß', 'ss')
        
        # Remove any remaining non-alphanumeric characters except underscores
        cleaned = ''.join(c for c in cleaned if c.isalnum() or c == '_')
        
        return cleaned or "Unknown"

    def create_study_session(self, data, files):
        student_id = data.get("student_id")
        if not student_id:
            raise ValueError("student_id is required")
        
        date = data.get("date", "").strip()
        
        return StudySession(
            student_id=int(student_id),
            date=date,
            start_time=data.get("start_time", "").strip(),
            end_time=data.get("end_time", "").strip(),
            session_topic=data.get("session_topic", "").strip(),
            pdf_path=self.save_pdf(files["pdf"], int(student_id), date)
        )