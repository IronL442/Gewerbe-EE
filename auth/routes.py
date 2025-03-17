from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from flask_login import login_user, login_required, logout_user, current_user
from app import bcrypt
import os
from dotenv import load_dotenv
from auth.user import StaticUser

# Load environment variables from .env
load_dotenv(override=True)

auth = Blueprint('auth', __name__)

# Load credentials from .env
USERNAME = os.getenv("ADMIN_USERNAME")
PASSWORD_HASH = os.getenv("ADMIN_PASSWORD")

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Compare input with stored credentials
        if username == USERNAME and bcrypt.check_password_hash(PASSWORD_HASH, password):
            print("✅ Username matches")
            user = StaticUser()  # Create dummy user object
            login_user(user, remember=True)
            session.permanent = True
            print(f"📝 Session Data After Login: {session}")  # Debugging session contents

            print(f"🔍 Is user authenticated? {current_user.is_authenticated}")  # Debugging
            return redirect(url_for('sessions.log_session'))
        else:
            print("❌ Username mismatch")
            flash('Invalid username or password', 'danger')

    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))