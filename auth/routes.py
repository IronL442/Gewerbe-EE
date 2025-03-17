from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user
from models import User
from app import bcrypt  # Import bcrypt for password checking

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Fetch the only user from the database
        user = User.query.first()

        if user and username == user.username and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('sessions.dashboard'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))