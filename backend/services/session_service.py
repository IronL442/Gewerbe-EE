import os
import base64
import uuid
from models.study_session import StudySession


class SessionService:
    def __init__(self):
        self.signature_dir = "data/signatures"

    def save_signature(self, signature_data):
        signature_filename = f"signature_{uuid.uuid4().hex}.png"
        signature_path = os.path.join(self.signature_dir, signature_filename)
        signature_image = signature_data.replace("data:image/png;base64,", "")
        with open(signature_path, "wb") as f:
            f.write(base64.b64decode(signature_image))
        return signature_path

    def create_study_session(self, data):
        return StudySession(
            student_name=data.get("student_name", "").strip(),
            date=data.get("date", "").strip(),
            start_time=data.get("start_time", "").strip(),
            end_time=data.get("end_time", "").strip(),
            session_topic=data.get("session_topic", "").strip(),
            signature_path=self.save_signature(data.get("signature_data")),
        )
