from flask import Blueprint, request, jsonify, session
from flask_login import login_user, login_required, logout_user, current_user
from app import bcrypt
import os
from dotenv import load_dotenv
from auth.user import StaticUser

load_dotenv(override=True)

auth = Blueprint("auth", __name__)

USERNAME = os.getenv("ADMIN_USERNAME")
PASSWORD_HASH = os.getenv("ADMIN_PASSWORD")


@auth.route("/login", methods=["POST"])
def login():
    # Expect JSON data from the frontend
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if username == USERNAME and bcrypt.check_password_hash(PASSWORD_HASH, password):
        print("✅ Username matches")
        user = StaticUser()
        login_user(user, remember=True)
        session.permanent = True
        print(f"📝 Session Data After Login: {session}")
        print(f"🔍 Is user authenticated? {current_user.is_authenticated}")
        return (
            jsonify(
                {"message": "Login successful", "redirect": "/sessions/log_session"}
            ),
            200,
        )

    print("❌ Username mismatch")
    return jsonify({"error": "Invalid username or password"}), 401
