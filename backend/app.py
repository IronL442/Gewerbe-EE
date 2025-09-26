from flask import Flask, redirect, url_for, jsonify, request
from flask_session import Session
from models.database import database, migrate
from utils.encryption import bcrypt
from flask_login import LoginManager
from datetime import timedelta
import os
from flask_talisman import Talisman
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix


from blueprints.auth_blueprint import auth_blueprint
from blueprints.session_blueprint import session_blueprint
from blueprints.student_blueprint import student_blueprint

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = os.getenv("SESSION_TYPE", "filesystem")
if app.config.get("SESSION_TYPE") == "redis":
    import redis
    app.config["SESSION_REDIS"] = redis.from_url(os.getenv("REDIS_URL"))
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=8)
database_uri = os.getenv("DATABASE_URL") or os.getenv("SQLALCHEMY_DATABASE_URI")
if database_uri and database_uri.startswith("postgres://"):
    database_uri = database_uri.replace("postgres://", "postgresql://", 1)

if not database_uri:
    raise RuntimeError("DATABASE_URL or SQLALCHEMY_DATABASE_URI must be set")

app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
app.config.setdefault("SQLALCHEMY_TRACK_MODIFICATIONS", False)


def env_flag(name: str, default: str = "true") -> bool:
    raw = os.getenv(name)
    if raw is None:
        raw = default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


USE_SECURE_COOKIES = env_flag("USE_SECURE_COOKIES", "true")
FORCE_HTTPS = env_flag("FORCE_HTTPS", "true")
COOKIE_SAMESITE = "None" if USE_SECURE_COOKIES else "Lax"
COOKIE_HTTPONLY = env_flag("XSRF_COOKIE_HTTPONLY", "true")

# Fail fast if SECRET_KEY is missing
if not app.config["SECRET_KEY"]:
    raise RuntimeError("SECRET_KEY must be set")

# Secure cookie settings (session + remember cookie)
app.config.update(
    SESSION_COOKIE_SECURE=USE_SECURE_COOKIES,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE=COOKIE_SAMESITE,
    REMEMBER_COOKIE_SECURE=USE_SECURE_COOKIES,
    REMEMBER_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_SAMESITE=COOKIE_SAMESITE,
    MAX_CONTENT_LENGTH=1 * 1024 * 1024,  # 1MB request size cap
)

# Security headers (HSTS, CSP, etc.)
_csp = {
    "default-src": "'self'",
    "img-src": "'self' data:",
    "style-src": "'self' 'unsafe-inline'",
    "script-src": "'self'",
    "connect-src": ("'self' " + os.getenv("CSP_CONNECT_SRC", "")).strip(),
}
Talisman(app, force_https=FORCE_HTTPS, content_security_policy=_csp)

# CSRF protection (for JSON: use X-CSRFToken header; see /api/csrf below)
CSRFProtect(app)

# CORS: allow only your frontend origin(s) if you serve API cross-origin
allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
if allowed_origins:
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

# Rate limiting (memory for dev; set REDIS_URL on Render)
limiter = Limiter(get_remote_address, app=app, storage_uri=os.getenv("REDIS_URL", "memory://"))

Session(app)

database.init_app(app)
migrate.init_app(app, database)
bcrypt.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = "auth.login"


@login_manager.user_loader
def load_user(user_id):
    from models.user import StaticUser

    if user_id == "1":
        return StaticUser()
    return None


@login_manager.unauthorized_handler
def _handle_unauthorized():
    """Return JSON for API callers; fall back to SPA entry for others."""
    if request.path.startswith("/api/"):
        return jsonify({"error": "Authentication required"}), 401
    return redirect("/login")


# Ensure signature folder exists
if not os.path.exists("./data/signatures"):
    os.makedirs("./data/signatures")

app.register_blueprint(auth_blueprint.blueprint, url_prefix="/api/auth")
app.register_blueprint(session_blueprint.blueprint, url_prefix="/api")
app.register_blueprint(student_blueprint.blueprint, url_prefix="/api")

limiter.limit("5/minute")(app.view_functions["auth.login"])

@app.route("/")
def home():
    return redirect(url_for("auth.login"))


@app.after_request
def _add_extra_headers(resp):
    # Referrer policy & MIME sniffing protection (Talisman covers most, add belt-and-suspenders)
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    return resp

# CSRF helper for SPAs: call this first to receive a token cookie
@app.get("/api/csrf")
def get_csrf():
    token = generate_csrf()
    # Expose a JS-readable token (standard double-submit pattern)
    resp = jsonify({"csrfToken": token})
    resp.set_cookie(
        "XSRF-TOKEN",
        token,
        secure=USE_SECURE_COOKIES,
        httponly=COOKIE_HTTPONLY,
        samesite=COOKIE_SAMESITE,
    )
    return resp, 200

# Health checks
@app.get("/healthz")
def healthz():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
