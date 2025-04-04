from flask import Flask, redirect, url_for
from flask_session import Session
from models.database import database, migrate
from utils.encryption import bcrypt
from flask_login import LoginManager
from datetime import timedelta
import os

from blueprints.auth_blueprint import auth_blueprint
from blueprints.session_blueprint import session_blueprint

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=8)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "SQLALCHEMY_DATABASE_URI"
)

database.init_app(app)
migrate.init_app(app, database)
bcrypt.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = "auth.login"


@login_manager.user_loader
def load_user(user_id):
    from models.user import StaticUser

    if user_id == "1":
        return StaticUser()
    return None


# Ensure signature folder exists
if not os.path.exists("./data/signatures"):
    os.makedirs("./data/signatures")

app.register_blueprint(auth_blueprint.blueprint, url_prefix="/auth")
app.register_blueprint(session_blueprint.blueprint, url_prefix="/sessions")


@app.route("/")
def home():
    return redirect(url_for("auth.login"))


if __name__ == "__main__":
    with app.app_context():
        database.create_all()
    app.run(debug=True, host="0.0.0.0")
