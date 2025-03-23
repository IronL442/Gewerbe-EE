import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Session from "./views/Session";
import PrivacyPolicy from './views/PrivacyPolicy';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/sessions/session" element={<Session />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* <-- new route */}
        {/* Add a dashboard route later */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
