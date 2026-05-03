import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-80 p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          className="w-full bg-[#8494FF] text-white p-2 rounded"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <span className="text-[#8494FF] cursor-pointer" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;