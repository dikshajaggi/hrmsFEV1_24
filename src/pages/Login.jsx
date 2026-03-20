import { useState } from "react";
import { useNavigate } from "react-router-dom";
import crimsonenergy from "../assets/crimsonenergy.svg"
import { loginUser } from "../apis";
import { useMainStore } from "../store/useMainStore";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const setUserDetails =  useMainStore((s) => s.setUserDetails);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await loginUser(form);
    sessionStorage.setItem("accessToken", res.data.accessToken);
     sessionStorage.setItem(
      "userDetails",
      JSON.stringify(res.data.user)
    );
    setUserDetails(res.data.user)
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-brand to-[#a60e25] text-white flex-col justify-center px-16">

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
          A modern workforce management platform designed to simplify
          attendance, leave management, and employee operations.
        </p>

        <p className="text-sm text-white/70 mt-6">
          Manage employees, attendance, and HR operations effortlessly.
        </p>

      </div>


      {/* RIGHT PANEL */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Sign in to your account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the dashboard.
          </p>


          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">

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
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>


            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>


            {/* Button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-brand hover:bg-[#a70d24] text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              Sign In
            </button>

          </form>


          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-brand font-medium cursor-pointer"
            >
              Register
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}