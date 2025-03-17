from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from flask_login import login_user, login_required, logout_user, UserMixin
from app import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

auth = Blueprint('auth', __name__)

# Load credentials from .env
USERNAME = os.getenv("ADMIN_USERNAME")
PASSWORD_HASH = bcrypt.generate_password_hash(os.getenv("ADMIN_PASSWORD")).decode("utf-8")

class StaticUser(UserMixin):  
    id = 1  # Required for Flask-Login

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Compare input with stored credentials
        if username == USERNAME and bcrypt.check_password_hash(PASSWORD_HASH, password):
            user = StaticUser()  # Create dummy user object
            login_user(user, remember=True)
            session.permanent = True
            return redirect(url_for('sessions.log_session'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))