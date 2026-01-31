import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) navigate("/login");
        API.get(`/users/${userId}`).then((res) => setUser(res.data));
    }, [userId, navigate]);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
            <div className="animate-pulse text-gray-400 font-medium">Loading profile...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f9fafb] py-12 px-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Profile Cover/Header Accent */}
                <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar Container */}
                    <div className="relative -mt-12 mb-6 flex justify-center">
                        <img
                            src={user.profileImage ? `http://localhost:5000${user.profileImage}` : "https://via.placeholder.com/150"}
                            alt="profile"
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-gray-50"
                        />
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user.name}</h2>
                        <p className="text-gray-500 text-sm font-medium">{user.email}</p>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Status</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Active</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">User ID</span>
                                <span className="text-sm font-mono text-gray-700 truncate">{userId}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { localStorage.clear(); navigate("/login"); }}
                        className="w-full mt-8 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:text-red-600 hover:border-red-100 transition-all text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}