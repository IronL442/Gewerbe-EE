from datetime import datetime
from models.database import database

class Customer(database.Model):
    __tablename__ = 'customers'
    
    id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    first_name = database.Column(database.String(100), nullable=False)
    last_name = database.Column(database.String(100), nullable=False)
    email = database.Column(database.String(255), nullable=True)
    phone = database.Column(database.String(50), nullable=True)
    address = database.Column(database.String(500), nullable=True)
    fastbill_customer_id = database.Column(database.String(100), nullable=True)
    
    @property
    def name(self):
        """Get full name from first_name + last_name"""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f"<Customer(id={self.id}, name={self.name})>"