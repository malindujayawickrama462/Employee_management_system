import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, Mail, Briefcase, MapPin, Calendar, Phone, Edit, Save, X, Hash } from 'lucide-react';
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
            // Note: If email/name changed, user might need to relogin or context needs update
            // However, for now, we just refresh local data
        } catch (error) {
            setMessage({ type: 'error', text: error.msg || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !employee) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0">
                <Header />
                <main className="flex-1 p-8 ml-64">
                    <div className="max-w-4xl mx-auto">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg shadow-md animate-fade-in ${message.type === 'success'
                                ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
                                : 'bg-red-100 border-l-4 border-red-500 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                            {/* Profile Header */}
                            <div className="relative px-8 pb-8">
                                <div className="absolute -top-16 left-8">
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-indigo-600 text-5xl font-bold uppercase">
                                        {employee?.name ? employee.name.charAt(0) : 'U'}
                                    </div>
                                </div>
                                <div className="pt-20 md:pt-4 flex justify-end">
                                    {!editMode ? (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md group"
                                        >
                                            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSubmit}
                                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save
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
                                                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 md:mt-2 md:ml-40">
                                    <h1 className="text-3xl font-bold text-gray-900">{employee?.name}</h1>
                                    <p className="text-indigo-600 font-medium capitalize">{employee?.position || 'Employee'}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="border-t border-gray-100 px-8 py-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Information Details</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Full Name</p>
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full mt-1 px-3 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    />
                                                ) : (
                                                    <p className="font-semibold text-gray-800">{employee?.name}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Email Address</p>
                                                {editMode ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full mt-1 px-3 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    />
                                                ) : (
                                                    <p className="font-semibold text-gray-800">{employee?.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Department</p>
                                                <p className="font-semibold text-gray-800">{employee?.department?.name || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Hash className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Employee ID</p>
                                                <p className="font-semibold text-gray-800">{employee?.employeeID}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 md:col-span-2">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Address</p>
                                                {editMode ? (
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="w-full mt-1 px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    />
                                                ) : (
                                                    <p className="font-semibold text-gray-800">{employee?.address || 'No address set'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
