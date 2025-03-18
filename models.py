from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from app import db

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    start_time = db.Column(db.String(5), nullable=False)
    end_time = db.Column(db.String(5), nullable=False)
    session_topic = db.Column(db.String(200), nullable=False)
    signature_path = db.Column(db.String(255), nullable=False)  # Path to signature image