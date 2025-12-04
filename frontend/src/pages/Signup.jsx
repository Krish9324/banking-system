import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      setSuccess("Signup successful. Please log in.");
      // small delay then redirect to correct login page
      setTimeout(() => {
        navigate(role === "BANKER" ? "/login/banker" : "/login/customer");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">Customer</option>
            <option value="BANKER">Banker</option>
          </select>
        </label>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" className="primary-btn">
          Sign up
        </button>
      </form>
    </div>
  );
}


