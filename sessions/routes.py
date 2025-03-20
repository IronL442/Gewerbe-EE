from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from models import db, StudySession
import os
import logging

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
        student_name = request.form.get('student_name', '').strip()
        date = request.form.get('date', '').strip()
        start_time = request.form.get('start_time', '').strip()
        end_time = request.form.get('end_time', '').strip()
        session_topic = request.form.get('session_topic', '').strip()
        signature_data = request.form.get('signature_data')

        print("📥 Received form data:", request.form)  # Print received form data

        # Debug: Check if current_user.id exists
        print(f"🆔 User ID: {current_user.id if current_user else 'None'}")

        # Debug: Print field types before creating the session
        print(f"🛠️ Field types -> student_name: {type(student_name)}, date: {type(date)}, start_time: {type(start_time)}, end_time: {type(end_time)}, session_topic: {type(session_topic)}")

        # Check for missing required fields
        if not student_name or not date or not start_time or not end_time or not session_topic:
            flash('All fields are required!', 'danger')
            return redirect(url_for('sessions.log_session'))
        
        if not signature_data:
            flash('Signature is required!', 'danger')
            return redirect(url_for('sessions.log_session'))

        # Process signature
        import base64
        import uuid
        signature_filename = f"signature_{uuid.uuid4().hex}.png"
        signature_path = os.path.join("static/signatures", signature_filename)
        
        # Decode and save signature
        signature_image = signature_data.replace("data:image/png;base64,", "")
        with open(signature_path, "wb") as f:
            f.write(base64.b64decode(signature_image))

        # Save session to database
        new_session = StudySession(
            user_id=current_user.id,
            student_name=student_name,
            date=date,
            start_time=start_time,
            end_time=end_time,
            session_topic=session_topic,
            signature_path=signature_path
        )

        print("✅ Adding session to database...")
        db.session.add(new_session)

        
        print("🔄 Committing session to database...")
        db.session.commit()
        print("✅ Session committed successfully!")

        flash('Session logged successfully!', 'success')
        return redirect(url_for('sessions.dashboard'))

    return render_template('log_session.html')