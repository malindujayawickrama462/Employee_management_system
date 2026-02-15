import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">


            <div className="w-full max-w-lg animate-fade-in relative z-10">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 glass mb-6 rounded-[2rem] shadow-2xl">
                        <LogIn className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-2">
                        EMP<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MANAGE</span>
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Premium Enterprise Portal</p>
                </div>

                {/* Login Card */}
                <div className="glass p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight text-center">Authentication</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1" htmlFor="email">
                                Identity / Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-indigo-500 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-16 pr-6 py-5 bg-white/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner placeholder-gray-300"
                                    placeholder="yourname@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between px-1 mb-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]" htmlFor="password">
                                    Secure Key
                                </label>
                                <a href="#" className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">Recovery?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-indigo-500 w-5 h-5" />
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full pl-16 pr-6 py-5 bg-white/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner placeholder-gray-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            COMMIT ACCESS
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-gray-500">
                            New Personnel?{' '}
                            <Link to="/register" className="text-indigo-600 hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-[10px] font-black tracking-widest uppercase">
                    © 2026 EMPMANAGE TECHNOLOGY GROUP • v2.0-STABLE
                </div>
            </div>
        </div>
    );
};

export default Login;
