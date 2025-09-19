import React from "react";
import ReactDOM from "react-dom/client";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Session from "./views/Session";
import AddStudentCustomer from "./views/AddStudentCustomer";
import PrivacyPolicy from './views/PrivacyPolicy';
import { ensureCsrfToken } from "./lib/api";

async function bootstrap() {
  try {
    await ensureCsrfToken();
  } catch (error) {
    console.error("Failed to initialize CSRF token", error);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/session" element={<Session />} />
          <Route path="/add-student-customer" element={<AddStudentCustomer />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();
