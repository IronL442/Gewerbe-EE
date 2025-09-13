from models.database import database
from sqlalchemy import LargeBinary
from datetime import datetime


class StudySession(database.Model):
    __tablename__ = 'study_sessions'
    
    id = database.Column(database.Integer, primary_key=True)
    student_id = database.Column(database.Integer, database.ForeignKey('students.id'), nullable=False)
    date = database.Column(database.String(10), nullable=False)
    start_time = database.Column(database.String(5), nullable=False)
    end_time = database.Column(database.String(5), nullable=False)
    session_topic = database.Column(database.String(200), nullable=False)
    pdf_path = database.Column(database.String(255), nullable=False)
    signature_present = database.Column(database.Boolean, nullable=False, default=False)
    signature_file_path = database.Column(database.String(500), nullable=True)
    
    def __repr__(self):
        return f"<StudySession(id={self.id}, student_id={self.student_id}, date={self.date})>"  