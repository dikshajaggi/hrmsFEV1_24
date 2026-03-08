import { useState } from "react";

export default function ForgotPassword() {

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Password reset instructions have been sent.");

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Forgot your password?
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter your username to reset your password.
        </p>

        {message && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-2">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />

          <button
            type="submit"
            className="w-full bg-brand text-white py-2 rounded-lg"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
}