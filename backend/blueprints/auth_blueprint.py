from flask import Blueprint, request, jsonify, session
from flask_login import login_user, current_user
from utils.encryption import bcrypt
from models.user import StaticUser
import os


class AuthBlueprint:
    def __init__(self):
        self.blueprint = Blueprint("auth", __name__)
        # Expect a bcrypt hash in ADMIN_PASSWORD_HASH
        self.username = os.getenv("ADMIN_USERNAME")
        self.password_hash = os.getenv("ADMIN_PASSWORD_HASH")
        self.__setup_routes()

    def __setup_routes(self):
        self.blueprint.add_url_rule("/login", view_func=self.login, methods=["POST"])

    def login(self):
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        if (
            self.username
            and self.password_hash
            and username == self.username
            and bcrypt.check_password_hash(self.password_hash, password)
        ):
            user = StaticUser()
            login_user(user, remember=True)
            session.permanent = True
            return jsonify({"message": "Login successful", "redirect": "/session"}), 200

        return jsonify({"error": "Invalid username or password"}), 401


auth_blueprint = AuthBlueprint()
