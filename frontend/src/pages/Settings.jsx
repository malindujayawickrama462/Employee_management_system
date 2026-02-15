import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import AdminSidebar from '../components/AdminSidebar';
import Sidebar from '../components/Sidebar';

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
        <div className="flex min-h-screen">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className={`flex-1 p-8 ml-72 transition-all duration-500 animate-fade-in`}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Account <span className="text-indigo-600">Settings</span></h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Security & Account Management</p>
                    </div>

                    {message.text && (
                        <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-green-500 text-green-800' : 'border-red-500 text-red-800'
                            }`}>
                            <div className="flex items-center gap-3">
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-bold">{message.text}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Password Change Card */}
                            <div className="glass p-10 rounded-[3rem] border border-white/50 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                        <KeyRound className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Security Credentials</h2>
                                        <p className="text-sm font-bold text-gray-400">Update your access key</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {[
                                        { name: 'currentPassword', label: 'Current Key', field: 'current' },
                                        { name: 'newPassword', label: 'New Executive Key', field: 'new' },
                                        { name: 'confirmPassword', label: 'Confirm New Key', field: 'confirm' }
                                    ].map((item) => (
                                        <div key={item.name}>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{item.label}</label>
                                            <div className="relative group">
                                                <input
                                                    type={showPasswords[item.field] ? 'text' : 'password'}
                                                    name={item.name}
                                                    value={passwords[item.name]}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-700 shadow-inner"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility(item.field)}
                                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-indigo-500 transition-colors"
                                                >
                                                    {showPasswords[item.field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-8 py-5 bg-gray-900 text-white rounded-2xl font-black tracking-widest shadow-2xl hover:bg-black transition-all transform active:scale-[0.98] uppercase flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                Authorize Change
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="glass p-8 rounded-[2.5rem] border border-white/50 shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                                <h3 className="font-black text-lg mb-4 tracking-tight">Security Tips</h3>
                                <ul className="space-y-4 text-sm font-medium opacity-90">
                                    <li className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        Use at least 8 characters with numbers and symbols.
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        Don't reuse passwords from other platforms.
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        Update your key every 90 days for maximum safety.
                                    </li>
                                </ul>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border border-indigo-100 shadow-lg bg-white/50">
                                <h3 className="font-black text-xs uppercase tracking-widest text-indigo-600 mb-4">Account Status</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500">Identity</span>
                                        <span className="text-sm font-black text-gray-900">{user?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500">Access Level</span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
