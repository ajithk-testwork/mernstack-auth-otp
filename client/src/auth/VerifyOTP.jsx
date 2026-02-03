import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const handleVerify = async (e) => {
  e.preventDefault();

  console.log("VERIFY DATA →", email, otp);

  try {
    await API.post("/verify-otp", { email, otp: otp.trim() });
    navigate("/reset-password");
  } catch (error) {
    alert(error.response?.data?.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg text-center tracking-widest"
          />

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
