from models.database import database


class DatabaseService:
    def commit_session(self):
        try:
            database.session.commit()
            return True
        except Exception as e:
            database.session.rollback()
            raise e

    def add_to_session(self, obj):
        database.session.add(obj)
