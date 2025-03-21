# Study Session Tracker Web App

## 📌 Project Overview
This is a Flask-based web application for tracking private study sessions. The app allows users to log study sessions, including student name, date, time, session topic, and a digital signature. It replaces manual paper-based tracking and integrates with FastBill for automated invoice creation.

## 🚀 (Planned) Features
- **Secure Login System** (Single user with `.env` credentials)
- **Session Logging** (Student name, date, time, session topic, signature)
- **PostgreSQL Database Integration**
- **Flask-Login for Authentication**
- **Signature Capture and Storage**
- **FastBill Integration for Automated Invoicing**

---

## 🛠 Installation and Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/study-session-tracker.git
cd study-session-tracker
```

### **2️⃣ Create a Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### **3️⃣ Install Dependencies**
```bash
pip install -r backend/requirements.txt
```

### **4️⃣ Set Up the `.env` File**
Create a `.env` file in the root directory and add:
```
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="yourpassword"
SECRET_KEY="your_random_secure_key"
SQLALCHEMY_DATABASE_URI="postgresql://myuser:mypassword@localhost:5432/study_sessions"
```
> **Tip**: Generate a secure key with `import secrets; print(secrets.token_hex(32))`

### **5️⃣ Set Up the Database**
```bash
docker-compose up -d
psql -h localhost -U myuser -d postgres -c "CREATE DATABASE study_session;"
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### **6️⃣ Run the Backend**
```bash
python run.py
```
The app will be accessible at: **`http://127.0.0.1:5000`**

### **7️⃣ Install the Frontend**

#### **Install Frontend Dependencies**
Navigate to the `frontend` directory and install the required Node.js packages:
```bash
cd frontend
npm install
```

#### **8️⃣ Start the Frontend**
Run the React development server:
```bash
npm run dev
```
The frontend will be accessible at: **`http://localhost:5173`**

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

## 🚀 Deployment
For production, use a WSGI server like **Gunicorn** and set environment variables manually on your server.
```bash
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="yourpassword"
export SECRET_KEY="your_random_secure_key"
export SQLALCHEMY_DATABASE_URI="postgresql://youruser:yourpassword@yourserver:5432/study_sessions"
```
To run the app with Gunicorn:
```bash
gunicorn -w 4 run:app
```

---

## 🛠 Technologies Used
- **Flask** (Web framework)
- **Flask-Login** (User authentication)
- **Flask-Bcrypt** (Password hashing)
- **Flask-SQLAlchemy** (Database ORM)
- **PostgreSQL** (Database)
- **JavaScript Canvas** (Signature capture)

---

## 🤝 Contributing
Feel free to submit issues or pull requests to improve this project!

---

## 📄 License
This project is licensed under the MIT License.

