# Study Session Tracker Web App

## 📌 Project Overview
This is a Flask-based web application for tracking private study sessions. The app allows users to log study sessions, including student name, date, time, session topic, and a digital signature. It replaces manual paper-based tracking and integrates with FastBill for automated invoice creation.

## 🚀 (Planned) Features
- [x] **Secure Login System** (Single user with `.env` credentials)
- [x] **Session Logging** (Student name, date, time, session topic, signature)
- [x] **PostgreSQL Database Integration**
- [ ] **Flask-Login for Authentication**
- [ ] **Signature Capture and Storage**
- [ ] **FastBill Integration for Automated Invoicing**

---

## 🛠 Installation and Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/study-session-tracker.git
cd study-session-tracker
```

### **2️⃣ Set Up the `.env` File**
Create a `.env` file in the `/backend` directory and add:
```
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="yourpassword"
SECRET_KEY="your_random_secure_key"
SQLALCHEMY_DATABASE_URI="postgresql://myuser:mypassword@postgres:5432/study_sessions"
```
> **Tip**: Generate a secure key with `import secrets; print(secrets.token_hex(32))`

### **3️⃣ Setup and manage Docker Container**
```bash
docker-compose up -d --build

# Initialize database migrations
docker exec -it backend-container flask db init
docker exec -it backend-container flask db migrate -m "Create all tables"
docker exec -it backend-container flask db upgrade

# Container management
docker-compose stop # Stop all containers
docker-compose start # Restart containers
```

### **🔧 Troubleshooting Database Issues**
If you encounter migration errors:
```bash
# Reset migrations completely
docker exec -it backend-container rm -rf /app/migrations
docker exec -it backend-container flask db init

# Create fresh migration
docker exec -it backend-container flask db migrate -m "Create all tables"
docker exec -it backend-container flask db upgrade
```

---

## 🔐 Authentication
1. Go to `http://127.0.0.1:5000/auth/login`
2. Enter the username and password from `.env`
3. You will be redirected to the session logging dashboard

---

## 📄 Usage Guide
1. **Login** using the admin credentials.
2. **Log a Study Session** by entering student details and signing.
3. **View Session History** on the dashboard.
4. **Logout** to end the session.

---

## 🤝 Contributing
Feel free to submit issues or pull requests to improve this project!

---

## 📄 License
This project is licensed under the MIT License.

