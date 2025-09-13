# This file makes the models directory a Python package
# Import all models to ensure they're registered with SQLAlchemy

from .database import database, migrate
from .user import StaticUser
from .customer import Customer
from .student import Student
from .study_session import StudySession

# Make sure all models are available when the package is imported
__all__ = ['database', 'migrate', 'StaticUser', 'Customer', 'Student', 'StudySession']