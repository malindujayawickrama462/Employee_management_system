/**
 * Profile.jsx - Personal Identity & Registry Management
 * 
 * This component allows employees (and admins) to view their personnel data
 * and update basic contact information. It features a sophisticated 
 * "Modify/Commit" workflow to prevent accidental data changes.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';
import { User, Mail, Briefcase, MapPin, Calendar, Phone, Edit, Save, X, Hash, ShieldCheck, BadgeCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMe, updateMe } from '../utils/employeeApi';

const Profile = () => {
    const { user } = useAuth();

    // -- Data & UI State --
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false); // Toggles between read-only and form input
    const [message, setMessage] = useState({ type: '', text: '' });

    // -- Form Buffer --
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });

    const isAdmin = user?.role === 'admin';

    /**
     * Effect: Load Profile on Mount
     */
    useEffect(() => {
        fetchEmployeeData();
    }, []);

    /**
     * fetchEmployeeData - Retrieves full personnel details from the backend.
     */
    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            const data = await getMe();
            setEmployee(data);
            // Sync form buffer with retrieved data
            setFormData({
                name: data.name || '',
                email: data.email || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * handleSubmit - Commits changes to the server and refreshes the local state.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateMe(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false); // Exit edit mode on success
            fetchEmployeeData(); // Refresh UI with server truth
        } catch (error) {
            setMessage({ type: 'error', text: error.msg || 'Failed to update profile.' });
        } finally {
            setLoading(false);
            // Self-dismissing notification
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    /**
     * Initial Loading State (Skeleton or Spinner)
     */
    if (loading && !employee) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--base-foundation)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Authenticating Identity...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar selection based on active role hierarchy */}
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className={`flex-1 flex flex-col ml-72 transition-all duration-500`}>
                {!isAdmin && <Header />}

                <main className="flex-1 p-8 pt-12 animate-fade-in relative">
                    <div className="max-w-5xl mx-auto">

                        {/* Title Section with Action Controls */}
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Personnel <span className="text-indigo-600">Profile</span></h1>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Registry Management • Internal Identity Card</p>
                            </div>

                            {/* View Switcher Controls */}
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-2xl hover:bg-black transition-all active:scale-95 group"
                                >
                                    <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    Modify Identity
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-2xl hover:bg-indigo-700 transition-all active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        Commit Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            // Revert changes on discard
                                            setFormData({
                                                name: employee.name,
                                                email: employee.email,
                                                address: employee.address
                                            });
                                        }}
                                        className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                        Discard
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status Messaging */}
                        {message.text && (
                            <div className={`mb-10 p-5 rounded-[2rem] shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-green-500 text-green-800' : 'border-red-500 text-red-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="font-bold">{message.text}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Identity Card - Non-editable primary identification */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="glass p-10 rounded-[3.5rem] border border-white/50 shadow-2xl relative overflow-hidden flex flex-col items-center">
                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-600 to-purple-700" />
                                    <div className="relative mt-8 mb-6">
                                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white bg-white shadow-2xl flex items-center justify-center text-indigo-600 text-5xl font-black uppercase overflow-hidden">
                                            {employee?.name ? employee.name.charAt(0) : 'U'}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
                                            <BadgeCheck className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center">{employee?.name}</h2>
                                    <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">{employee?.position || 'Personnel'}</p>

                                    <div className="w-full space-y-4 border-t border-indigo-50 pt-8">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Division</span>
                                            <span className="text-xs font-black text-gray-700">{employee?.department?.name || 'Central'}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Unique Identifier Token */}
                                <div className="glass p-8 rounded-[2.5rem] border border-white/50 shadow-xl space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">System Footprint</h3>
                                    <div className="p-4 bg-gray-50/50 rounded-2xl flex items-center gap-4">
                                        <Hash className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Personnel ID</p>
                                            <p className="text-sm font-black text-gray-700">{employee?.employeeID}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information - Editable Fields */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="glass p-12 rounded-[3.5rem] border border-white/50 shadow-2xl">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Personal Credentials</h2>
                                            <p className="text-sm font-bold text-gray-400">Restricted and general information</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { name: 'name', label: 'Authorized Identity', icon: User, placeholder: 'Hideo Kojima' },
                                                { name: 'email', label: 'Communication Hub', icon: Mail, type: 'email', placeholder: 'hideo@kojimaproductions.com' }
                                            ].map((field) => (
                                                <div key={field.name}>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{field.label}</label>
                                                    <div className="relative group">
                                                        <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                                                        <input
                                                            type={field.type || 'text'}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleInputChange}
                                                            disabled={!editMode}
                                                            required
                                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-black text-gray-700 shadow-inner placeholder-gray-300 disabled:bg-gray-50/50 disabled:cursor-not-allowed"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Residential Coordinates (Address)</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-6 top-6 text-gray-300 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    rows="4"
                                                    className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-black text-gray-700 shadow-inner resize-none placeholder-gray-300 disabled:bg-gray-50/50 disabled:cursor-not-allowed"
                                                    placeholder="Detailed location..."
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
