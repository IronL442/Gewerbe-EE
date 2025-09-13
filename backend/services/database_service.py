from utils.logger import logger
from models.database import database

class DatabaseService:
    def __init__(self):
        self.session = database.session

    def add_to_session(self, obj):
        self.session.add(obj)

    def commit_session(self):
        self.session.commit()

    def rollback_session(self):
        self.session.rollback()

    def close_session(self):
        pass

    # Customer-related methods
    def get_all_customers(self):
        """Get all customers from the database"""
        try:
            from models.customer import Customer
            customers = self.session.query(Customer).all()
            logger.info(f"📊 Retrieved {len(customers)} customers from database")
            return customers
        except Exception as e:
            logger.error(f"❌ Error fetching customers: {e}")
            raise

    def get_customer_by_id(self, customer_id):
        """Get a specific customer by ID"""
        try:
            from models.customer import Customer
            customer = self.session.query(Customer).filter_by(id=customer_id).first()
            return customer
        except Exception as e:
            logger.error(f"❌ Error fetching customer {customer_id}: {e}")
            raise

    def create_customer(self, first_name, last_name, email=None, phone=None, address=None, fastbill_customer_id=None):
        """Create a new customer"""
        try:
            from models.customer import Customer
            
            # Check if customer already exists by email
            if email:
                existing_customer = self.session.query(Customer).filter_by(email=email).first()
                if existing_customer:
                    raise ValueError("Customer with this email already exists")

            new_customer = Customer(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                address=address,
                fastbill_customer_id=fastbill_customer_id
            )
            
            self.add_to_session(new_customer)
            self.commit_session()
            logger.info(f"✅ Created new customer: {new_customer.name}")
            return new_customer
        except Exception as e:
            self.rollback_session()
            logger.error(f"❌ Error creating customer: {e}")
            raise

    def get_customers_for_dropdown(self):
        """Get all customers formatted for frontend dropdown"""
        try:
            customers = self.get_all_customers()
            customers_data = []
            for customer in customers:
                customers_data.append({
                    'id': customer.id,
                    'name': customer.name,
                })
            
            logger.info(f"✅ Formatted {len(customers_data)} customers for dropdown")
            return customers_data
        except Exception as e:
            logger.error(f"❌ Error formatting customers for dropdown: {e}")
            raise

    # Student-related methods
    def get_all_students(self):
        """Get all students from the database"""
        try:
            from models.student import Student
            students = self.session.query(Student).all()
            logger.info(f"📊 Retrieved {len(students)} students from database")
            return students
        except Exception as e:
            logger.error(f"❌ Error fetching students: {e}")
            raise

    def get_student_by_id(self, student_id):
        """Get a specific student by ID"""
        try:
            from models.student import Student
            student = self.session.query(Student).filter_by(id=student_id).first()
            return student
        except Exception as e:
            logger.error(f"❌ Error fetching student {student_id}: {e}")
            raise

    def create_student(self, first_name, last_name, customer_id, email=None, phone=None, school=None, grade_level=None):
        """Create a new student"""
        try:
            from models.student import Student
            
            customer = self.get_customer_by_id(customer_id)
            if not customer:
                raise ValueError("Customer not found")
            
            # Check if student already exists for this customer
            existing_student = self.session.query(Student).filter_by(
                first_name=first_name,
                last_name=last_name,
                customer_id=customer_id
            ).first()
            
            if existing_student:
                raise ValueError("Student already exists for this customer")

            new_student = Student(
                first_name=first_name,
                last_name=last_name,
                customer_id=customer_id,
            )
            
            self.add_to_session(new_student)
            self.commit_session()
            logger.info(f"✅ Created new student: {new_student.name}")
            return new_student
        except Exception as e:
            self.rollback_session()
            logger.error(f"❌ Error creating student: {e}")
            raise

    def get_students_for_dropdown(self):
        """Get all students formatted for frontend dropdown"""
        try:
            students = self.get_all_students()
            students_data = []
            for student in students:
                students_data.append({
                    "id": student.id,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "full_name": student.name
                })
            
            logger.info(f"✅ Formatted {len(students_data)} students for dropdown")
            return students_data
        except Exception as e:
            logger.error(f"❌ Error formatting students for dropdown: {e}")
            raise
