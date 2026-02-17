import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus, ChevronRight, AlertCircle, Building2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/user/add", {
                name,
                email,
                password,
                role: "employee"
            });
            if (response.data.success || response.data._id || response.data) {
                navigate('/login');
            } else {
                setError("Registration failed");
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            <div className="w-full max-w-lg animate-fade-in relative z-10">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 mb-6 rounded-2xl shadow-sm">
                        <UserPlus className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        EMP<span className="text-indigo-600">MANAGE</span>
                    </h1>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Employee Registration</p>
                </div>

                {/* Register Card */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-200 relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight text-center">Create Account</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500 w-5 h-5" />
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm placeholder-slate-300 outline-none"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm placeholder-slate-300 outline-none"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500 w-4 h-4" />
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm placeholder-slate-300 outline-none text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1" htmlFor="confirmPassword">
                                    Confirm
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500 w-4 h-4" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm placeholder-slate-300 outline-none text-sm"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group text-xs uppercase"
                        >
                            Create Account
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                    © 2026 EMPMANAGE • All Rights Reserved
                </div>
            </div>
        </div>
    );
};

export default Register;
