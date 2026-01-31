import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user.id);
            setIsLoggedIn(true);
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f9fafb] py-12 px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 sm:p-10">
                    {!isLoggedIn ? (
                        <>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                                <p className="text-gray-500 text-sm mt-2">Please enter your details to sign in.</p>
                            </div>
                            <form className="space-y-5" onSubmit={handleLogin}>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="jane@example.com" 
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••••" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all" 
                                    />
                                </div>
                                <button className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-lg hover:bg-black transition-all active:scale-[0.98] shadow-md">
                                    Sign In
                                </button>
                            </form>
                            
                            {/* Sign Up Navigation Link */}
                            <div className="mt-8 text-center border-t border-gray-50 pt-6">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-gray-900 font-bold hover:underline underline-offset-4 transition-all">
                                        Sign up free
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                            <div className="mb-6 flex justify-center">
                                <div className="rounded-full bg-green-100 p-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Login Successful</h2>
                            <p className="text-gray-500 mt-2 mb-8">You are now authenticated.</p>
                            <button 
                                onClick={() => navigate('/profile')} 
                                className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                            >
                                View Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;