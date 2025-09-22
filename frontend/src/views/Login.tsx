import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api, ensureCsrfToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ensureCsrfToken();
      const response = await api.post("/api/auth/login", { username, password });
      if (response.status === 200) {
        navigate(response.data.redirect);
      }
    } catch (err: any) {
      console.error("Login failed", err);
      const message =
        err.response?.data?.error || err.message || "Invalid username or password";
      setError(message);
      }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container w-25">
        <h2 className="text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
