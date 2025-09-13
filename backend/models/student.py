from datetime import datetime
from models.database import database

class Student(database.Model):
    __tablename__ = 'students'
    
    id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    first_name = database.Column(database.String(100), nullable=False)
    last_name = database.Column(database.String(100), nullable=False)
    customer_id = database.Column(database.Integer, database.ForeignKey('customers.id'), nullable=False)  # Added this

    @property
    def name(self):
        """Get full name from first_name + last_name"""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f"<Student(id={self.id}, name={self.name})>"