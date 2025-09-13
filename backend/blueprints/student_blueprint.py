from flask import Blueprint, request, jsonify
from flask_login import login_required
from services.database_service import DatabaseService
from utils.logger import logger


class StudentBlueprint:
    def __init__(self):
        self.blueprint = Blueprint("students", __name__)
        self.database_service = DatabaseService()
        self.__setup_routes()

    def __setup_routes(self):
        self.blueprint.add_url_rule(
            "/customers", view_func=self.get_customers, methods=["GET"]
        )
        self.blueprint.add_url_rule(
            "/customers", view_func=self.create_customer, methods=["POST"]
        )
        self.blueprint.add_url_rule(
            "/students", view_func=self.create_student, methods=["POST"]
        )

    @login_required
    def get_customers(self):
        """Get all customers for dropdown selection in AddStudentCustomer"""
        try:
            customers_data = self.database_service.get_customers_for_dropdown()
            return jsonify(customers_data), 200
        except Exception as e:
            logger.error(f"❌ Error in get_customers endpoint: {str(e)}")
            return jsonify({'error': 'Failed to fetch customers'}), 500

    @login_required
    def create_customer(self):
        """Create a new customer in AddStudentCustomer"""
        try:
            data = request.get_json()
            logger.info(f"📥 Received customer data: {data}")
            
            # Validate required fields
            if not data.get('first_name') or not data.get('last_name'):
                return jsonify({'error': 'First name and last name are required'}), 400

            # Create customer using database service
            new_customer = self.database_service.create_customer(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data.get('email'),
                phone=data.get('phone'),
                address=data.get('address')
            )
            
            return jsonify({
                'id': new_customer.id,
                'name': new_customer.name,
                'email': new_customer.email
            }), 201
            
        except ValueError as e:
            logger.warning(f"⚠️ Validation error: {str(e)}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"❌ Error in create_customer endpoint: {str(e)}")
            return jsonify({'error': 'Failed to create customer'}), 500

    @login_required
    def create_student(self):
        """Create a new student in AddStudentCustomer"""
        try:
            data = request.get_json()
            logger.info(f"📥 Received student data: {data}")
            
            # Validate required fields
            if not data.get('customer_id'):
                return jsonify({'error': 'Customer ID is required'}), 400
            
            if not data.get('first_name') or not data.get('last_name'):
                return jsonify({'error': 'First name and last name are required'}), 400
            
            # Create student using database service
            new_student = self.database_service.create_student(
                first_name=data['first_name'],
                last_name=data['last_name'],
                customer_id=data['customer_id'],
            )
            
            return jsonify({
                'id': new_student.id,
                'name': new_student.name,
                'customer_id': new_student.customer_id,
                'first_name': new_student.first_name,
                'last_name': new_student.last_name,
            }), 201
            
        except ValueError as e:
            logger.warning(f"⚠️ Validation error: {str(e)}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"❌ Error in create_student endpoint: {str(e)}")
            return jsonify({'error': 'Failed to create student'}), 500


student_blueprint = StudentBlueprint()