import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Employee Dashboard</h1>
                <p className="text-gray-600 mb-4">Welcome, <span className="font-bold">{user?.name}</span>!</p>
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Employee Access</p>
                    <p>You can view your profile, leave status, and salary history.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:shadow-outline"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
