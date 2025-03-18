from flask import Flask, redirect, url_for
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from dotenv import load_dotenv
from datetime import timedelta
import secrets
import os
from auth.user import StaticUser

load_dotenv(override=True)

# Initialize Flask app
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"  # Store session data in a file
Session(app)  # Initialize Flask-Session
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", secrets.token_hex(32))  # Use .env or generate a fallback key
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=8)  # Sessions last for 8 hours
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/enterprise-db'

db = SQLAlchemy()  # Initialize without an app
db.init_app(app)   # Bind later in app.py

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

# Return the same static user

@login_manager.user_loader
def load_user(user_id):
    print(f"🔄 Trying to load user {user_id}")  # Debugging output
    if user_id == "1": # Ensure it matches the static user ID
        print("✅ User loaded successfully")  # Debugging output
        return StaticUser() # Flask-Login User Loader
    print("❌ No user found")  # Debugging output
    return None

# Ensure signature folder exists
if not os.path.exists('static/signatures'):
    os.makedirs('static/signatures')

# Import and register blueprints
from auth.routes import auth
from sessions.routes import sessions

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(sessions, url_prefix='/sessions')

# Home route redirects to login
@app.route('/')
def home():
    return redirect(url_for('auth.login'))

if __name__ == '__main__':
    app.run(debug=True)