from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/study_sessions'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

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
