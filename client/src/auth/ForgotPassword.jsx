import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/forgot-password", { email });
      localStorage.setItem("resetEmail", email);
      navigate("/verify-otp");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive an OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
