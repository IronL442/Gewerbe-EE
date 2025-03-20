from flask import Blueprint, request, jsonify
from flask_login import login_required
from models import db, StudySession
import os
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

    if not all(
        [student_name, date, start_time, end_time, session_topic, signature_data]
    ):
        return jsonify({"error": "All fields and signature are required"}), 400

    signature_filename = f"signature_{uuid.uuid4().hex}.png"
    signature_path = os.path.join("data/signatures", signature_filename)
    signature_image = signature_data.replace("data:image/png;base64,", "")
    with open(signature_path, "wb") as f:
        f.write(base64.b64decode(signature_image))

    new_session = StudySession(
        student_name=student_name,
        date=date,
        start_time=start_time,
        end_time=end_time,
        session_topic=session_topic,
        signature_path=signature_path,
    )

    db.session.add(new_session)
    db.session.commit()

    return jsonify({"message": "Session logged successfully"}), 200
