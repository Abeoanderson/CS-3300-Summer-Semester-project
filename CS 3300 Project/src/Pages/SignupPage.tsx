import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/api.js";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill out all fields.");
      return;
    }
    const success = await signup(username, password);
    if (success) navigate("/login");
    else alert("Signup failed. Try a different username.");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="container p-4 border rounded shadow"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="mb-4 text-center">Sign Up</h2>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Create Account
        </button>

        <div className="mt-3 text-center">
          <small>
            Already have an account? <a href="/login">Login here</a>
          </small>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
