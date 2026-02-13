import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, Mail, Briefcase, MapPin, Calendar, Phone } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0">
                <Header />
                <main className="flex-1 p-8 ml-64">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                            {/* Profile Header */}
                            <div className="relative px-8 pb-8">
                                <div className="absolute -top-16 left-8">
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-indigo-600 text-5xl font-bold uppercase">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                </div>
                                <div className="pt-20 pl-40 md:pl-0 md:pt-4 md:text-right"> {/* Adjusted layout for responsiveness logic if needed, simplify for now */}
                                    {/* Placeholder for Edit Profile button if implemented later */}
                                </div>
                                <div className="mt-6 md:mt-0 md:ml-40"> {/* Push content to right of avatar */}
                                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-indigo-600 font-medium capitalize">{user.role}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="border-t border-gray-100 px-8 py-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Role / Designation</p>
                                            <p className="font-semibold text-gray-800 capitalize">{user.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-semibold text-gray-800">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Placeholders for future data */}
                                    <div className="flex items-start space-x-4 opacity-50">
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-400">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-400">Not set</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 opacity-50">
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-400">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Office Location</p>
                                            <p className="font-medium text-gray-400">Main HQ</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 opacity-50">
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-400">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Joined Date</p>
                                            <p className="font-medium text-gray-400">--/--/----</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 opacity-50">
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Employee ID</p>
                                            <p className="font-medium text-gray-400">EMP-XXXX</p>
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

export default Profile;
