import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/FormPage.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <div className="input-group">
          <input
            placeholder=" "
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder=" "
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit">Login</button>

        {/* Don't have an account section */}
        <div className="redirect-link">
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className="link">
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
