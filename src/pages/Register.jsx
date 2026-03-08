import { useState } from "react";
import crimsonenergy from "../assets/crimsonenergy.svg"
import { Link } from "react-router-dom";

export default function Register() {

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left Section */}
        <div className="hidden lg:flex w-1/2 bg-brand text-white flex-col justify-center px-16">
        <div className="absolute top-6 left-10 flex items-center gap-2">
            <img src={crimsonenergy} className="h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] mr-2" />
            <span className="text-white font-semibold text-lg">
                Crimson HRMS
            </span>
        </div>

        <h1 className="text-xl font-semibold text-white">
            Welcome to Crimson HRMS
        </h1>

        <p className="text-white/90 text-lg leading-relaxed max-w-md">
          A modern workforce management platform designed to simplify
          attendance, leave management, and employee operations.
        </p>

        <div className="mt-10 text-sm text-white/80">
          Streamline HR operations with analytics-driven insights.
        </div>

      </div>


      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create your account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Register to request access. Your account will be activated after HR approval.
          </p>


          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-sm text-gray-600">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>


            {/* Submit */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-brand hover:bg-[#a70d24] text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              Request Access
            </button>

          </form>


          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login">
                <span className="text-brand font-medium cursor-pointer">
                Sign in
                </span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}