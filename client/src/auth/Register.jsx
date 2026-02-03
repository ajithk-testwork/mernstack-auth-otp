import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import API from '../api';

const Register = () => {// Initialize navigation
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        image: null
    });

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setForm({ ...form, image: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", form.name);
        data.append("email", form.email);
        data.append("password", form.password);
        data.append("image", form.image);

        

        try {
            
            await API.post("/users/register", data);
            alert("Registered Successfully!");
            navigate("/login"); 
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f9fafb] py-12 px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 sm:p-10">
                    
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create account</h2>
                        <p className="text-gray-500 text-sm mt-2">Join us to start managing your workflow.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Full Name</label>
                            <input 
                                name="name" 
                                type="text"
                                placeholder="Name" 
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
                            <input 
                                name="email" 
                                type="email"
                                placeholder="Email" 
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••"
                                onChange={handleChange} 
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Profile Photo</label>
                            <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${form.image ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                    {form.image ? (
                                        <>
                                            <svg className="w-6 h-6 mb-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-xs text-green-600 font-medium">Selected: {form.image.name.substring(0, 20)}...</p>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-xs text-gray-500">Click to upload avatar</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" name="image" onChange={handleChange} className="hidden" />
                            </label>
                        </div>

                        <button className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-lg hover:bg-black transition-all active:scale-[0.98] duration-150 shadow-md">
                            Register
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-gray-900 font-bold hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;