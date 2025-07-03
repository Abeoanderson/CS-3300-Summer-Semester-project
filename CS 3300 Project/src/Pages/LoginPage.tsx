import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await login(username, password);
    if (token) navigate("/dashboard");
    else alert("Invalid credentials.");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="container p-4 border rounded shadow"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="mb-4 text-center">Login</h2>

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

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <div className="mt-3 text-center">
          <small>
            Don’t have an account?{" "}
            <a href="/signup" className="text-decoration-none">
              Sign up
            </a>
          </small>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
