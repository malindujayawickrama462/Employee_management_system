import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { getLeaves, updateLeaveStatus } from '../utils/leaveApi';
import AdminSidebar from '../components/AdminSidebar';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const data = await getLeaves();
            setLeaves(data.leaves);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await updateLeaveStatus(id, status);
            setMessage({ type: 'success', text: `Leave request ${status.toLowerCase()} successfully!` });
            fetchLeaves();
        } catch (error) {
            setMessage({ type: 'error', text: error.msg || 'Failed to update leave status' });
        } finally {
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const filteredLeaves = leaves.filter(leave => {
        const matchesSearch = leave.employeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Review and manage employee absence requests.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search ID or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-medium text-slate-700 shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-12 pr-8 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm appearance-none min-w-[140px]"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Leave Type</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Period</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredLeaves.length > 0 ? filteredLeaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-slate-50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                                                    {leave.employeeID.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{leave.employeeID}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-indigo-600 text-sm">{leave.leaveType}</td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-700">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                                                Requested on {new Date(leave.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(leave.status)}`}>
                                                <Clock className="w-3 h-3" />
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            {leave.status === 'Pending' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'Approved')}
                                                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl transition-all"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'Rejected')}
                                                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-slate-400 font-bold font-medium">No leave requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
