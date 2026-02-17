import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';
import { User, Mail, Briefcase, MapPin, Calendar, Phone, Edit, Save, X, Hash, ShieldCheck, BadgeCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMe, updateMe } from '../utils/employeeApi';

const Profile = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            const data = await getMe();
            setEmployee(data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateMe(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false);
            fetchEmployeeData();
        } catch (error) {
            setMessage({ type: 'error', text: error.msg || 'Failed to update profile.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    if (loading && !employee) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Loading Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className="flex-1 flex flex-col ml-72">
                {!isAdmin && <Header />}

                <main className="flex-1 p-8 pt-12 animate-fade-in">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
                                <p className="text-slate-500 font-medium text-sm mt-1">View and manage your personal information</p>
                            </div>

                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                name: employee.name,
                                                email: employee.email,
                                                address: employee.address
                                            });
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {message.text && (
                            <div className={`mb-10 p-4 rounded-xl shadow-sm animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                                    <span className="font-bold text-sm">{message.text}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-3xl bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center text-indigo-600 text-4xl font-bold mb-6">
                                        {employee?.name ? employee.name.charAt(0) : 'U'}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">{employee?.name}</h2>
                                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{employee?.position || 'Associate'}</p>

                                    <div className="w-full space-y-4 border-t border-slate-100 pt-8 mt-8">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</span>
                                            <span className="text-xs font-bold text-slate-700">{employee?.department?.name || 'General'}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Employment Details</h3>
                                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                                        <Hash className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</p>
                                            <p className="text-sm font-bold text-slate-700">{employee?.employeeID}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personal Information</h2>
                                            <p className="text-sm font-medium text-slate-400">Update your basic profile details here</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { name: 'name', label: 'Full Name', icon: User, placeholder: 'Enter your name' },
                                                { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'Enter your email' }
                                            ].map((field) => (
                                                <div key={field.name}>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{field.label}</label>
                                                    <div className="relative">
                                                        <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                                        <input
                                                            type={field.type || 'text'}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleInputChange}
                                                            disabled={!editMode}
                                                            required
                                                            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm disabled:bg-slate-50/50 disabled:cursor-not-allowed"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Permanent Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-5 top-6 text-slate-300 w-5 h-5" />
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    rows="4"
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm resize-none disabled:bg-slate-50/50 disabled:cursor-not-allowed"
                                                    placeholder="Enter your address..."
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
