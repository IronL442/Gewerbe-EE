from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from models import db, StudySession
import os

sessions = Blueprint('sessions', __name__)

@sessions.route('/dashboard')
@login_required
def dashboard():
    user_sessions = StudySession.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', sessions=user_sessions)

@sessions.route('/log_session', methods=['GET', 'POST'])
@login_required
def log_session():
    if request.method == 'POST':
        student_name = request.form['student_name']
        date = request.form['date']
        time = request.form['time']
        session_topic = request.form['session_topic']
        signature = request.files['signature']

        if signature:
            signature_path = f"static/signatures/{signature.filename}"
            signature.save(signature_path)

            new_session = StudySession(
                user_id=current_user.id,
                student_name=student_name,
                date=date,
                time=time,
                session_topic=session_topic,
                signature_path=signature_path
            )
            db.session.add(new_session)
            db.session.commit()

            flash('Session logged successfully!', 'success')
            return redirect(url_for('sessions.dashboard'))
        else:
            flash('Signature is required!', 'danger')
            return redirect(url_for('sessions.log_session'))

    return render_template('log_session.html')