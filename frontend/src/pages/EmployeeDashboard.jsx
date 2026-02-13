import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
    Clock,
    Calendar,
    DollarSign,
    FileText,
    CalendarCheck
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 ${color}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
            <div className={`p-2 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-').replace('500', '100')}`}>
                <Icon className={`w-5 h-5 ${color.replace('border-', 'text-')}`} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-xs font-medium text-green-500">+2.5%</span> {/* Mock change */}
        </div>
    </div>
);



const EmployeeDashboard = () => {
    const { user } = useAuth();

    // Mock Data
    const stats = [
        { icon: Calendar, title: 'Leave Balance', value: '12 Days', color: 'border-blue-500' },
        { icon: Clock, title: 'Attendance', value: '95%', color: 'border-green-500' },
        { icon: DollarSign, title: 'Next Salary', value: '$2,450', color: 'border-yellow-500' },
        { icon: FileText, title: 'Pending Tasks', value: '5', color: 'border-red-500' },
    ];

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-gray-50 font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-0"> {/* Sidebar is fixed, but giving margin-left handled by layout or sidebar wrapper? Sidebar is fixed. Content needs ml-64 */}
                    <Header />
                    <main className="flex-1 p-8 ml-64">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome back, <span className="text-indigo-600">{user?.name}</span>
                            </h1>
                            <p className="mt-2 text-gray-600">Here's what's happening with your account today.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Content Area - e.g. Recent Activity, Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content Pane */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {i === 1 ? 'L' : i === 2 ? 'S' : 'T'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{i === 1 ? 'Leave Approved' : i === 2 ? 'Salary Credited' : 'Task Completed'}</p>
                                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                                Completed
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Side Widgets */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
                                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-left px-4 flex items-center">
                                        <CalendarCheck className="w-5 h-5 mr-3" />
                                        Request Leave
                                    </button>
                                    <button className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-left px-4 flex items-center">
                                        <FileText className="w-5 h-5 mr-3" />
                                        Download Payslip
                                    </button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                                    <p className="text-sm font-medium opacity-80">Next Holiday</p>
                                    <p className="text-xl font-bold mt-1">New Year's Day</p>
                                    <p className="text-sm opacity-60">Jan 1, 2026</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default EmployeeDashboard;
