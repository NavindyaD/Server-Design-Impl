import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/register", form);
      setMessage(`Registered! Your API Key: ${res.data.apiKey}`);
    } catch (err) {
      setMessage("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;
