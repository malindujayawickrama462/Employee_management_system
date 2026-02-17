import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, KeyRound, Eye, EyeOff, Shield } from 'lucide-react';
import api from '../utils/api';
import AdminSidebar from '../components/AdminSidebar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Settings = () => {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const isAdmin = user?.role === 'admin';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            await api.post('/user/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: "Password updated successfully!" });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.msg || "Failed to update password" });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className="flex-1 ml-72 flex flex-col">
                {!isAdmin && <Header />}

                <main className="p-8 pt-12 animate-fade-in">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">Security & Account Management</p>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-xl shadow-sm animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                                    <span className="font-bold text-sm">{message.text}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600">
                                            <KeyRound className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Change Password</h2>
                                            <p className="text-sm font-medium text-slate-400">Update your account security details</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {[
                                            { name: 'currentPassword', label: 'Current Password', field: 'current' },
                                            { name: 'newPassword', label: 'New Password', field: 'new' },
                                            { name: 'confirmPassword', label: 'Confirm New Password', field: 'confirm' }
                                        ].map((item) => (
                                            <div key={item.name}>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{item.label}</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords[item.field] ? 'text' : 'password'}
                                                        name={item.name}
                                                        value={passwords[item.name]}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm outline-none"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility(item.field)}
                                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                                                    >
                                                        {showPasswords[item.field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processing...' : (
                                                <>
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Update Password
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-lg text-white">
                                    <h3 className="font-bold text-lg mb-4 tracking-tight flex items-center gap-2">
                                        <Lock className="w-5 h-5" /> Security Tips
                                    </h3>
                                    <ul className="space-y-4 text-xs font-medium opacity-90 leading-relaxed">
                                        <li className="flex gap-3">
                                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">1</div>
                                            Use a combination of letters, numbers and special characters.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">2</div>
                                            Avoid using common words or personal information like birthdays.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">3</div>
                                            Change your password regularly to keep your account safe.
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600 mb-4">Account Status</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400">User</span>
                                            <span className="text-xs font-bold text-slate-700">{user?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400">Role</span>
                                            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
