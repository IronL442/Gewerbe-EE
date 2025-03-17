from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "fallback_secret_key")  # Load from .env or use fallback
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=8)  # Sessions last for 8 hour
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/enterprise-db'

db = SQLAlchemy()  # Initialize without an app
db.init_app(app)   # Bind later in app.py

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

# Import User AFTER db is initialized
from models import User  

# Flask-Login User Loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

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