from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from services.session_service import SessionService
from services.database_service import DatabaseService
from utils.logger import logger


class SessionBlueprint:
    def __init__(self):
        self.blueprint = Blueprint("sessions", __name__)
        self.session_service = SessionService()
        self.database_service = DatabaseService()
        self.__setup_routes()

    def __setup_routes(self):
        self.blueprint.add_url_rule(
            "/session", view_func=self.log_session, methods=["POST"]
        )

    @login_required
    def log_session(self):
        data = request.form
        files = request.files

        required_fields = [
            "student_name",
            "date",
            "start_time",
            "end_time",
            "session_topic",
            "signature_present",
        ]
        if not all(data.get(field) or files.get(field) for field in required_fields):
            logger.warning("⚠️ Missing required fields: %s", data)
            return jsonify({"error": "All fields and signature are required"}), 400

        logger.info("📥 Received JSON data: %s", data)
        logger.debug("🆔 User ID: %s", current_user.id)

        try:
            new_session = self.session_service.create_study_session(data, files)
            self.database_service.add_to_session(new_session)
            self.database_service.commit_session()
            logger.info("✅ Session committed successfully!")
            return jsonify({"message": "Session logged successfully"}), 200
        except Exception as e:
            logger.error("❌ Error committing session to database: %s", e)
            return jsonify({"error": "Error committing session to database"}), 500


session_blueprint = SessionBlueprint()
