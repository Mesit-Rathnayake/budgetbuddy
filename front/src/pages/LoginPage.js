import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogImage from "../Images/LogIn.jpg";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      // Save token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("✅ Logged in successfully! Redirecting...");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
  <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto my-12">
        
        {/* Left column (form) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Holla, Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Log in to your account and start managing your budgets
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="stanley@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-green-600" />
                Remember me
              </label>
              <a href="#" className="text-green-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            >
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right column (image) */}
        <div className="hidden md:flex w-1/2 bg-white p-4">
          <img
            src={LogImage}
            alt="Login Illustration"
            className="w-full h-full object-contain rounded-2xl shadow-lg"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
