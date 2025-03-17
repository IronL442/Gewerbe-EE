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
        start_time = request.form['start_time']
        end_time = request.form['end_time']
        session_topic = request.form['session_topic']
        signature_data = request.form['signature_data']  # Extract Base64 signature
        
        if signature_data:
            # Convert Base64 image data to an actual image file
            import base64
            import uuid

            signature_filename = f"signature_{uuid.uuid4().hex}.png"
            signature_path = os.path.join("static/signatures", signature_filename)

            # Decode and save the image
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
            signature_path=signature_path if signature_data else None
            )

        db.session.add(new_session)
        db.session.commit()

        flash('Session logged successfully!', 'success')
        return redirect(url_for('sessions.dashboard'))
    else:
        flash('Signature is required!', 'danger')
        return redirect(url_for('sessions.log_session'))

    return render_template('log_session.html')