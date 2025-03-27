from models.database import database
from sqlalchemy import LargeBinary


class StudySession(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    student_name = database.Column(database.String(100), nullable=False)
    date = database.Column(database.String(10), nullable=False)
    start_time = database.Column(database.String(5), nullable=False)
    end_time = database.Column(database.String(5), nullable=False)
    session_topic = database.Column(database.String(200), nullable=False)
    pdf_path = database.Column(database.String(255), nullable=False)