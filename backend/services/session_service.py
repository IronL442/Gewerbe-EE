import os
import uuid
from models.study_session import StudySession
from models.student import Student
from models.database import database
from datetime import datetime
from services.r2_storage import r2_storage
import tempfile
import logging

logger = logging.getLogger(__name__)

class SessionService:
    def __init__(self):
        # Always keep a local fallback directory in case R2 is unavailable
        self.pdf_dir = "data/completed_forms"
        os.makedirs(self.pdf_dir, exist_ok=True)

        if r2_storage.is_available():
            logger.info("Using R2 storage for file uploads")
        else:
            logger.warning("R2 storage unavailable; using local storage fallback")

    def generate_pdf_filename(self, student_id, date):
        """
        Generate PDF filename from student and date information
        
        Args:
            student_id: ID of the student
            date: Date string in YYYY-MM-DD format
            
        Returns:
            String: Generated filename
        """
        student = Student.query.get(student_id)
        if not student:
            # Fallback to UUID if student not found
            return f"form_{uuid.uuid4().hex}.pdf"
        
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
        
        return f"{first_name}_{last_name}_{formatted_date}.pdf"

    def save_pdf(self, pdf_file, student_id, date):
        """
        Save PDF to R2 or local storage with meaningful filename
        
        Args:
            pdf_file: File object from form upload
            student_id: ID of the student
            date: Date string in YYYY-MM-DD format
            
        Returns:
            bool: True if successful
        """
        pdf_filename = self.generate_pdf_filename(student_id, date)

        # Read PDF data
        pdf_file.seek(0)  # Reset file pointer to beginning
        pdf_data = pdf_file.read()

        if r2_storage.is_available():
            # Upload to R2
            file_key = f"completed_forms/{pdf_filename}"
            
            # Handle duplicates by adding timestamp if needed
            counter = 1
            original_filename = pdf_filename
            while True:
                try:
                    file_url = r2_storage.upload_file(
                        file_data=pdf_data,
                        file_name=file_key,
                        content_type='application/pdf'
                    )
                    if file_url:
                        logger.info(f"PDF uploaded to R2: {file_key}")
                        return file_key
                    else:
                        # If upload failed, try with incremented name
                        name_without_ext = original_filename.replace('.pdf', '')
                        pdf_filename = f"{name_without_ext}_{counter}.pdf"
                        file_key = f"completed_forms/{pdf_filename}"
                        counter += 1
                        
                        if counter > 10:  # Prevent infinite loop
                            logger.error("Failed to upload PDF after multiple attempts")
                            break
                except Exception as e:
                    logger.error(f"R2 upload failed: {e}")
                    break
        
        # Fallback to local storage
        logger.info("Falling back to local storage")
        pdf_path = os.path.join(self.pdf_dir, pdf_filename)
        
        # Handle duplicate filenames locally
        counter = 1
        original_filename = pdf_filename
        while os.path.exists(pdf_path):
            name_without_ext = original_filename.replace('.pdf', '')
            pdf_filename = f"{name_without_ext}_{counter}.pdf"
            pdf_path = os.path.join(self.pdf_dir, pdf_filename)
            counter += 1
        
        # Save to local storage
        try:
            with open(pdf_path, 'wb') as f:
                f.write(pdf_data)
            logger.info(f"PDF saved locally: {pdf_path}")
            return pdf_path
        except Exception as e:
            logger.error(f"Failed to save PDF locally: {e}")
            return None

    def get_pdf_url(self, student_id, date, expiration=3600):
        """
        Get a downloadable URL for a PDF based on student and date
        
        Args:
            student_id: ID of the student
            date: Date string in YYYY-MM-DD format
            expiration: URL expiration in seconds (default 1 hour)
            
        Returns:
            Downloadable URL or None if file doesn't exist
        """
        pdf_filename = self.generate_pdf_filename(student_id, date)
        
        if r2_storage.is_available():
            file_key = f"completed_forms/{pdf_filename}"
            # Check if file exists and generate presigned URL
            presigned_url = r2_storage.generate_presigned_url(file_key, expiration)
            if presigned_url:
                return presigned_url
        
        # For local storage, check if file exists
        pdf_path = os.path.join(self.pdf_dir, pdf_filename)
        if os.path.exists(pdf_path):
            return f"/api/files/{pdf_filename}"
        
        return None

    def delete_pdf(self, student_id, date):
        """
        Delete PDF from storage based on student and date
        
        Args:
            student_id: ID of the student
            date: Date string in YYYY-MM-DD format
            
        Returns:
            bool: True if successful
        """
        pdf_filename = self.generate_pdf_filename(student_id, date)
        success = False
        
        if r2_storage.is_available():
            file_key = f"completed_forms/{pdf_filename}"
            success = r2_storage.delete_file(file_key)
            if success:
                logger.info(f"PDF deleted from R2: {file_key}")
        
        # Also try local storage cleanup
        try:
            pdf_path = os.path.join(self.pdf_dir, pdf_filename)
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
                logger.info(f"PDF deleted locally: {pdf_path}")
                success = True
        except Exception as e:
            logger.error(f"Failed to delete local PDF: {e}")
        
        return success

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
        """
        Create a new study session with PDF storage
        """
        student_id = data.get("student_id")
        if not student_id:
            raise ValueError("student_id is required")
        
        date = data.get("date", "").strip()
        
        # Save PDF (we don't need to store the path anymore)
        pdf_path = self.save_pdf(files["pdf"], int(student_id), date)

        if not pdf_path:
            raise Exception("Failed to save PDF")

        return StudySession(
            student_id=int(student_id),
            date=date,
            start_time=data.get("start_time", "").strip(),
            end_time=data.get("end_time", "").strip(),
            session_topic=data.get("session_topic", "").strip(),
            signature_present=data.get("signature_present", "false").lower() == "true"
        )

# Global instance
session_service = SessionService()
