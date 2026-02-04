import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, Camera } from "lucide-react";
import API from '../api';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        image: null
    });

    const handleChange = (e) => {
        if (e.target.name === "image") {
            const file = e.target.files[0];
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", form.name);
        data.append("email", form.email);
        data.append("password", form.password);
        if (form.image) data.append("image", form.image);

        try {
            await API.post("/users/register", data);
            alert("Registered Successfully!");
            navigate("/login"); 
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center py-12 px-4 font-sans">
            <div className="w-full max-w-lg relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-15 transition duration-1000 group-hover:opacity-25"></div>

                <div className="relative bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    
                    <div className="p-8 sm:p-10">
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
                                <UserPlus size={28} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Join us today to manage your workflow effortlessly.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group/avatar">
                                    <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center transition-all ${form.image ? 'border-indigo-100' : ''}`}>
                                        {preview ? (
                                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="text-slate-300" size={32} />
                                        )}
                                    </div>
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                                        <input type="file" name="image" onChange={handleChange} className="hidden" accept="image/*" />
                                        <span className="text-[10px] font-bold uppercase">Upload</span>
                                    </label>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Avatar Optional</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group/field">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        name="name" 
                                        type="text"
                                        required
                                        placeholder="John Doe" 
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        name="email" 
                                        type="email"
                                        required
                                        placeholder="john@example.com" 
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group/field">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        placeholder="••••••••"
                                        onChange={handleChange} 
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-slate-900 cursor-pointer text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <UserPlus size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-slate-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 underline-offset-4 hover:underline transition-all">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;