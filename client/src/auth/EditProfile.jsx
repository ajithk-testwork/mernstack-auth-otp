import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User, Mail, ArrowLeft, Loader2, Save } from "lucide-react";
import API from "../api";

export default function EditProfile() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({ name: "", email: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return navigate("/login");

        API.get(`/users/${userId}`).then((res) => {
            setForm({ name: res.data.name, email: res.data.email });
            if (res.data.profileImage) {
                setPreview(`http://localhost:5000${res.data.profileImage}`);
            }
        });
    }, [userId, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/users/${userId}`, form);
            if (image) {
                const data = new FormData();
                data.append("image", image);
                await API.put(`/users/${userId}/profile-image`, data);
            }
            navigate("/profile");
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12 px-4 flex justify-center items-center font-sans">
            <div className="w-full max-w-lg relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-15"></div>

                <div className="relative bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-8 pt-8 flex items-center justify-between">
                        <button 
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
                        <div className="w-9"></div> 
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="relative group/avatar">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                                    <img
                                        src={preview || "https://via.placeholder.com/150"}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-3xl opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                                    <Camera size={24} />
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Tap image to change</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full relative bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}