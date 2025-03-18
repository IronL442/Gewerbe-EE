from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from app import db
from sqlalchemy import Date, Time

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(Time, nullable=False)  # Add start_time
    end_time = db.Column(Time, nullable=False)  # Add end_time
    session_topic = db.Column(db.String(200), nullable=False)
    signature_path = db.Column(db.String(255), nullable=False)  # Path to signature image