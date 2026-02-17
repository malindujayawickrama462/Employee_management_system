import React, { useState, useEffect } from 'react';
import { getIndividualReport } from '../utils/analyticsApi';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { User, DollarSign, TrendingUp, Calendar, Download, X, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const EmployeeReportModal = ({ employeeID, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeID) fetchData();
    }, [employeeID]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getIndividualReport(employeeID);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch individual report", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/analytics/report/${employeeID}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${employeeID}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("PDF export failed", error);
        }
    };

    if (!employeeID) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white/90 w-full max-w-5xl h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white/50 flex flex-col">
                {/* Header */}
                <div className="px-12 py-10 border-b border-indigo-50 bg-indigo-50/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
                            Personnel <span className="text-indigo-600">Intelligence Brief</span>
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Classification: Confidential • ID: {employeeID}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                        >
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button onClick={onClose} className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center font-black uppercase tracking-widest text-indigo-600 animate-pulse">
                        Compiling Analytical Data...
                    </div>
                ) : data && (
                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                        {/* Profile Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/50 shadow-xl flex items-center gap-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                    {data.employee.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">{data.employee.name}</h3>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                                        <div className="text-[10px] font-black uppercase text-gray-400">Position <span className="text-gray-900 ml-2">{data.employee.position}</span></div>
                                        <div className="text-[10px] font-black uppercase text-gray-400">Division <span className="text-gray-900 ml-2">{data.employee.department?.name || "N/A"}</span></div>
                                        <div className="text-[10px] font-black uppercase text-gray-400">Status <span className="text-green-600 ml-2">Active Protocols</span></div>
                                        <div className="text-[10px] font-black uppercase text-gray-400">Email <span className="text-gray-900 ml-2">{data.employee.email}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-8 rounded-[2.5rem] border border-white/50 shadow-xl flex flex-col justify-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avg Performance</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h4 className="text-4xl font-black text-indigo-600 italic tracking-tighter">
                                        {data.performanceHistory.length > 0
                                            ? (data.performanceHistory.reduce((acc, curr) => acc + curr.overallRating, 0) / data.performanceHistory.length).toFixed(1)
                                            : "N/A"
                                        }
                                    </h4>
                                    <span className="text-xs font-black text-gray-400 mb-1.5 uppercase">/ 5.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Performance Trend */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Assessment Trajectory
                                </h4>
                                <div className="h-[300px] w-full bg-gray-50/50 rounded-[2.5rem] p-6 border border-indigo-50/50">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={[...data.performanceHistory].reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                            <XAxis dataKey="period" tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="overallRating" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Payout Trend */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Compensation History
                                </h4>
                                <div className="h-[300px] w-full bg-gray-50/50 rounded-[2.5rem] p-6 border border-indigo-50/50">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[...data.payrollHistory].reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="netSalary" fill="#7C3AED" radius={[8, 8, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Details Table */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Leave Protocol Summary
                            </h4>
                            <div className="grid grid-cols-4 gap-6">
                                {['Pending', 'Approved', 'Rejected'].map(status => {
                                    const stat = data.leaveStats.find(s => s._id === status);
                                    return (
                                        <div key={status} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{status}</p>
                                            <h5 className="text-2xl font-black text-gray-900 mt-1">{stat?.count || 0}</h5>
                                        </div>
                                    );
                                })}
                                <div className="bg-indigo-600/5 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Total Leaves</p>
                                        <h5 className="text-2xl font-black text-indigo-600 mt-1">
                                            {data.leaveStats.reduce((acc, curr) => acc + curr.count, 0)}
                                        </h5>
                                    </div>
                                    <Calendar className="w-8 h-8 text-indigo-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeReportModal;
