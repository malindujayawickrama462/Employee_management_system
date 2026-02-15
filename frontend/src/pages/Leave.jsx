import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Plus, Send } from 'lucide-react';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My <span className="text-indigo-600">Leaves</span></h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manage your absence requests and track their status.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Request Leave
                </button>
            </div>

            {message.text && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            <div className="glass rounded-[2rem] overflow-hidden bg-white/40">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-white/20">
                            <th className="px-8 py-5">Leave Type</th>
                            <th className="px-8 py-5">Duration</th>
                            <th className="px-8 py-5">Reason</th>
                            <th className="px-8 py-5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {leaves.length > 0 ? leaves.map((leave) => (
                            <tr key={leave._id} className="hover:bg-white/30 transition-colors">
                                <td className="px-8 py-6 font-bold text-gray-900">{leave.leaveType}</td>
                                <td className="px-8 py-6">
                                    <div className="text-sm font-bold text-gray-700">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-black tracking-tighter uppercase">
                                        Applied on {new Date(leave.appliedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(leave.status)}`}>
                                        {getStatusIcon(leave.status)}
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <div className="glass bg-white/95 rounded-[3rem] max-w-lg w-full p-10 animate-scale-in">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-8">Request Absence</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Leave Type</label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-700 shadow-inner appearance-none"
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
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-700 shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-700 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Reason</label>
                                <textarea
                                    name="reason"
                                    rows="4"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all font-bold text-gray-700 shadow-inner resize-none"
                                    placeholder="Briefly explain the reason for leave..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black tracking-widest hover:bg-gray-200 transition-all uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black tracking-widest shadow-xl hover:bg-indigo-700 transition-all uppercase flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit</>}
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
