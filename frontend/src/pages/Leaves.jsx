import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Calendar, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

const Leaves = () => {
    const [showForm, setShowForm] = useState(false);

    // Mock Data
    const [leaves, setLeaves] = useState([
        { id: 1, type: 'Sick Leave', from: '2026-01-15', to: '2026-01-16', status: 'Approved', reason: 'Flu' },
        { id: 2, type: 'Casual Leave', from: '2026-02-10', to: '2026-02-10', status: 'Pending', reason: 'Personal work' },
        { id: 3, type: 'Annual Leave', from: '2025-12-25', to: '2025-12-31', status: 'Rejected', reason: 'Busy season' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-600 bg-green-100';
            case 'Pending': return 'text-yellow-600 bg-yellow-100';
            case 'Rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Pending': return <Clock className="w-4 h-4 mr-1" />;
            case 'Rejected': return <XCircle className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0">
                <Header />
                <main className="flex-1 p-8 ml-64">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">My Leaves</h1>
                                <p className="text-gray-600 mt-1">Manage your leave applications and history</p>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Apply Leave</span>
                            </button>
                        </div>

                        {/* Apply Leave Form (Collapsible) */}
                        {showForm && (
                            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-indigo-100 animate-fade-in-down">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">New Leave Application</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                        <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border">
                                            <option>Sick Leave</option>
                                            <option>Casual Leave</option>
                                            <option>Annual Leave</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                            <input type="date" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                            <input type="date" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                        <textarea rows="3" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" placeholder="Brief reason for leave..."></textarea>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => alert("Application functionality coming soon!")}
                                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                        >
                                            Submit Application
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Leave History Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{leave.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{leave.from} <span className="text-gray-400 mx-1">to</span> {leave.to}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{leave.reason}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(leave.status)}`}>
                                                    {getStatusIcon(leave.status)}
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Leaves;
