from models.database import database
from sqlalchemy import LargeBinary


class Customer(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    name = database.Column(database.String(100), nullable=False)
    email = database.Column(database.String(100), nullable=False)
    fastbill_customer_id = database.Column(database.String(50), nullable=False)  # from FastBill
    students = database.relationship("Student", back_populates="parent")

class Student(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    name = database.Column(database.String(100), nullable=False)
    customer_id = database.Column(database.Integer, database.ForeignKey('customer.id'), nullable=False)
    parent = database.relationship("Customer", back_populates="students")
    sessions = database.relationship("StudySession", back_populates="student")

class StudySession(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    student_id = database.Column(database.Integer, database.ForeignKey('student.id'), nullable=False)
    student_name = database.Column(database.String(100), nullable=False)
    date = database.Column(database.String(10), nullable=False)
    start_time = database.Column(database.String(5), nullable=False)
    end_time = database.Column(database.String(5), nullable=False)
    session_topic = database.Column(database.String(200), nullable=False)
    pdf_path = database.Column(database.String(255), nullable=False)
    student = database.relationship("Student", back_populates="sessions")