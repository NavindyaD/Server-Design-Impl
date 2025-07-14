import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/FormPage.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert("Something went wrong during registration.");
      }
      console.error("Registration error:", error);
    }
  };
  
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

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
            placeholder=" "
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit">Register</button>

        <div className="redirect-link">
          <p>Have an account? <span onClick={() => navigate("/")} className="link">Login</span></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
