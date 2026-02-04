import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import API from "../api";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/verify-otp", { email, otp: otp.trim() });
      navigate("/reset-password");
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur opacity-15"></div>
        
        <div className="relative bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify OTP</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">We've sent a code to <span className="text-slate-900 font-bold">{email}</span></p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center block mb-2">6-Digit Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border-2 border-slate-100 bg-slate-50 px-4 py-4 rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-200"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm text-slate-400 font-medium">
            Didn't get the code? <button className="text-indigo-600 font-bold hover:underline">Resend</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;