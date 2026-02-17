import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle, Building2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const result = await login(email, password);
        if (result.success) {
            if (result.data.role === "admin") {
                navigate('/admin-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            <div className="w-full max-w-lg animate-fade-in relative z-10">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 mb-6 rounded-2xl shadow-sm">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        EMP<span className="text-indigo-600">MANAGE</span>
                    </h1>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Employee Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-200 relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight text-center">Login</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div>
                            <div className="flex items-center justify-between px-1 mb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500 w-5 h-5" />
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm placeholder-slate-300 outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group text-xs uppercase"
                        >
                            Sign In
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            New Employee?{' '}
                            <Link to="/register" className="text-indigo-600 hover:underline">
                                Request Access
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

export default Login;
