import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Plus, Send, X } from 'lucide-react';
import { addLeave, getEmployeeLeaves } from '../utils/leaveApi';

const Leave = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        if (user?.employeeID) {
            fetchLeaves();
        }
    }, [user]);

    const fetchLeaves = async () => {
        try {
            const data = await getEmployeeLeaves(user.employeeID);
            setLeaves(data.leaves);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addLeave({ ...formData, employeeID: user.employeeID });
            setMessage({ type: 'success', text: 'Leave request submitted successfully!' });
            setShowModal(false);
            setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            setMessage({ type: 'error', text: error.msg || 'Failed to submit leave request' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 ml-72">
                <Header />
                <main className="p-8 pt-12 animate-fade-in">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">Manage your absence requests and track their status</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Request Leave
                        </button>
                    </div>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                            <span className="font-bold text-sm">{message.text}</span>
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Leave Type</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dates</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reason</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {leaves.length > 0 ? leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-bold text-slate-900">{leave.leaveType}</td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-700">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                                                Applied on {new Date(leave.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-500 max-w-xs truncate">{leave.reason}</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(leave.status)}`}>
                                                <Clock className="w-3 h-3" />
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold">No leave requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fade-in">
                    <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Leave Request</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Leave Type</label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm outline-none"
                                >
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Annual Leave</option>
                                    <option>Maternity Leave</option>
                                    <option>Paternity Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Reason</label>
                                <textarea
                                    name="reason"
                                    rows="4"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm resize-none outline-none"
                                    placeholder="Please explain the reason for your leave..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Request</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leave;
