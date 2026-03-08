import { useState } from "react";
import { useNavigate } from "react-router-dom";
import crimsonenergy from "../assets/crimsonenergy.svg"

export default function FirstLogin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const userId = localStorage.getItem("firstLoginUserId");

      const res = await fetch(`/api/auth/complete-first-login/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          newPassword: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to set password");
      }

      setSuccess("Password set successfully. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#C8102E] to-[#a60e25] text-white flex-col justify-center px-16">

         <div className="absolute top-6 left-10 flex items-center gap-2">
            <img src={crimsonenergy} className="h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] mr-2" />
            <span className="text-white font-semibold text-lg">
                Crimson HRMS
            </span>
        </div>

        <h1 className="text-xl font-semibold text-white">
            Welcome to Crimson HRMS
        </h1>

        <p className="text-lg text-white/90 max-w-md leading-relaxed">
          Your account has been approved by HR. Please create a password
          to activate your account and access the system.
        </p>

      </div>


      {/* RIGHT PANEL */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Set Your Password
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            This is required before your first login.
          </p>


          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-2">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div>
              <label className="text-sm text-gray-600">
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>


            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-600">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>


            <button
              type="submit"
              className="cursor-pointer w-full bg-brand hover:bg-[#a70d24] text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              Set Password
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}