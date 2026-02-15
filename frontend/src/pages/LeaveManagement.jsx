import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { getLeaves, updateLeaveStatus } from '../utils/leaveApi';

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
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Leave <span className="text-indigo-600">Administrative</span></h1>
                    <p className="text-gray-500 font-medium tracking-tight">Review and manage employee absence requests.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by ID or Type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl transition-all font-bold text-gray-700 shadow-inner"
                        />
                    </div>
                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-12 pr-8 py-3 bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl transition-all font-bold text-gray-700 shadow-inner appearance-none min-w-[140px]"
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
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            <div className="glass rounded-[2rem] overflow-hidden bg-white/40 border border-white/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4 px-6 pb-6">
                        <thead>
                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-4 py-2">Personnel ID</th>
                                <th className="px-4 py-2">Leave Type</th>
                                <th className="px-4 py-2">Period</th>
                                <th className="px-4 py-2">Reason</th>
                                <th className="px-4 py-2">Current Status</th>
                                <th className="px-4 py-2 text-center">Executive Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeaves.length > 0 ? filteredLeaves.map((leave) => (
                                <tr key={leave._id} className="glass hover:bg-white transition-all cursor-default group">
                                    <td className="px-4 py-6 rounded-l-[1.5rem]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 shadow-inner">
                                                {leave.employeeID.slice(-2)}
                                            </div>
                                            <span className="font-black text-gray-900">{leave.employeeID}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 font-bold text-indigo-600/80">{leave.leaveType}</td>
                                    <td className="px-4 py-6">
                                        <div className="text-sm font-black text-gray-700">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-black tracking-tighter uppercase uppercase">
                                            Request on {new Date(leave.appliedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-sm text-gray-500 max-w-xs">{leave.reason}</td>
                                    <td className="px-4 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(leave.status)}`}>
                                            <Clock className="w-3 h-3" />
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 rounded-r-[1.5rem] text-center">
                                        {leave.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Approved')}
                                                    className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Rejected')}
                                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Actioned</div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic">No leave requests matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
