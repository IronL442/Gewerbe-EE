from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, StudySession
import os
from config.logger_config import Logger
import base64
import uuid

sessions = Blueprint("sessions", __name__)


@sessions.route("/log_session", methods=["POST"])
@login_required
def log_session():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    student_name = data.get("student_name", "").strip()
    date = data.get("date", "").strip()
    start_time = data.get("start_time", "").strip()
    end_time = data.get("end_time", "").strip()
    session_topic = data.get("session_topic", "").strip()
    signature_data = data.get("signature_data")

    Logger.info("📥 Received JSON data: %s", data)

    Logger.debug("🆔 User ID: %s", current_user.id if current_user else 'None')

    # Debug: Print field types before creating the session
    Logger.debug("🛠️ Field types -> student_name: %s, date: %s, start_time: %s, end_time: %s, session_topic: %s", 
                    type(student_name), type(date), type(start_time), type(end_time), type(session_topic))

    if not all(
        [student_name, date, start_time, end_time, session_topic, signature_data]
    ):
        Logger.warning("⚠️ Missing required fields: student_name=%s, date=%s, start_time=%s, end_time=%s, session_topic=%s, signature_data=%s", 
                       student_name, date, start_time, end_time, session_topic, signature_data)
        
        return jsonify({"error": "All fields and signature are required"}), 400

    signature_filename = f"signature_{uuid.uuid4().hex}.png"
    signature_path = os.path.join("data/signatures", signature_filename)
    signature_image = signature_data.replace("data:image/png;base64,", "")
    with open(signature_path, "wb") as f:
        f.write(base64.b64decode(signature_image))

    new_session = StudySession(
        user_id=current_user.id,
        student_name=student_name,
        date=date,
        start_time=start_time,
        end_time=end_time,
        session_topic=session_topic,
        signature_path=signature_path,
    )

        Logger.info("✅ Adding session to database...")
        db.session.add(new_session)

        
        try:
            Logger.info("🔄 Committing session to database...")
            db.session.commit()
            Logger.info("✅ Session committed successfully!")
        except Exception as e:
            db.session.rollback()
            Logger.error("❌ Error committing session to database: %s", e)
            flash("An error occurred while saving the session.", "danger")
            return redirect(url_for('sessions.log_session'))

    return jsonify({"message": "Session logged successfully"}), 200
