import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail, ShieldCheck, Fingerprint } from "lucide-react"; 
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/login");
    API.get(`/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [userId, navigate]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-600 font-semibold tracking-wide">
            Securely loading...
          </p>
        </div>
      </div>
    );

  const handleLogoutUser = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      console.log("Logout Error: ", error);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12 px-4 flex justify-center items-center font-sans">
      <div className="w-full max-w-lg relative group">
        
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>

        <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="h-32 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-10 pb-10">
            
            <div className="relative -mt-16 mb-8 flex flex-col items-center">
              <div className="p-1.5 bg-white rounded-3xl shadow-xl">
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt="profile"
                  className="w-28 h-28 rounded-2xl object-cover bg-slate-100"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-indigo-100">
                  <ShieldCheck size={14} /> Verified Member
                </span>
              </div>
            </div>

          
            <div className="grid grid-cols-1 gap-4">
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Email Address
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Fingerprint size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    User Identifier
                  </span>
                  <span className="text-xs font-mono text-slate-500 break-all">
                    {userId}
                  </span>
                </div>
              </div>
            </div>

       
            <div className="mt-10 flex flex-col gap-3">
              <button
                onClick={() => navigate("/edit-profile")}
                className="w-full bg-slate-900 cursor-pointer text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogoutUser}
                className="group w-full flex items-center justify-center cursor-pointer gap-2 text-slate-500 font-bold py-3 rounded-2xl hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut
                  size={18}
                  className="group-hover:translate-x-1  transition-transform"
                />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
