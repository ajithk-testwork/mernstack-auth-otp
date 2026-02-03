import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("otp"); // optional if you store it

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/reset-password", {
        email,
        newPassword: password,
      });

      localStorage.removeItem("resetEmail");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
