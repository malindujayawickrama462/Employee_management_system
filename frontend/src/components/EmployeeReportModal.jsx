import React, { useState, useEffect } from 'react';
import { getIndividualReport } from '../utils/analyticsApi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    Legend
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Performance Report
                            <ShieldCheck className="w-6 h-6 text-indigo-500" />
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Employee ID: {employeeID}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button onClick={onClose} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center font-bold uppercase tracking-widest text-indigo-600 animate-pulse">
                        Loading Analytical Data...
                    </div>
                ) : data && (
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                        {/* Profile Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-center gap-8">
                                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                    {data.employee.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900">{data.employee.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                                        <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between">Position <span className="text-slate-900 ml-2">{data.employee.position}</span></div>
                                        <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between">Department <span className="text-slate-900 ml-2">{data.employee.department?.name || "N/A"}</span></div>
                                        <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between">Status <span className="text-emerald-600 ml-2">Active</span></div>
                                        <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between">Email <span className="text-slate-900 ml-2">{data.employee.email}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-center shadow-sm">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Performance</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h4 className="text-4xl font-black text-indigo-600 tracking-tight">
                                        {data.performanceHistory.length > 0
                                            ? (data.performanceHistory.reduce((acc, curr) => acc + curr.overallRating, 0) / data.performanceHistory.length).toFixed(1)
                                            : "N/A"
                                        }
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400 mb-1.5 uppercase">/ 5.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Radar Intelligence & Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            <div className="bg-slate-900 p-8 rounded-3xl text-white relative shadow-xl overflow-hidden">
                                <h3 className="text-lg font-bold mb-8 tracking-tight">Performance Benchmarks</h3>
                                <div className="h-[280px] w-full relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                            { subject: 'Reliability', A: 85, fullMark: 150 },
                                            { subject: 'Efficiency', A: 98, fullMark: 150 },
                                            { subject: 'Integrity', A: 92, fullMark: 150 },
                                            { subject: 'Collaboration', A: 88, fullMark: 150 },
                                            { subject: 'Leadership', A: 75, fullMark: 150 },
                                            { subject: 'Innovation', A: 95, fullMark: 150 },
                                        ]}>
                                            <PolarGrid stroke="#ffffff20" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 8, fontWeight: 700 }} />
                                            <Radar name="Employee" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-2xl border border-slate-200 h-full shadow-sm flex flex-col justify-center">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Summary Metrics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Avg Rating', val: '4.8/5.0', color: 'text-indigo-600' },
                                            { label: 'Attendance', val: '96.2%', color: 'text-emerald-600' },
                                            { label: 'Projects', val: '12 Active', color: 'text-amber-600' },
                                            { label: 'Efficiency', val: '+14%', color: 'text-indigo-600' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mb-1">{stat.label}</p>
                                                <p className={`text-base font-bold ${stat.color}`}>{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase text-[10px] tracking-widest">
                                        View All Logs
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* History Trends */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Performance Trend */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-600" /> Assessment History
                                </h4>
                                <div className="h-[250px] w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={[...data.performanceHistory].reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis dataKey="period" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Line type="monotone" dataKey="overallRating" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Payout Trend */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-indigo-600" /> Salary History
                                </h4>
                                <div className="h-[250px] w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[...data.payrollHistory].reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="netSalary" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Leave Stats */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-600" /> Leave Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Pending', 'Approved', 'Rejected'].map(status => {
                                    const stat = data.leaveStats.find(s => s._id === status);
                                    return (
                                        <div key={status} className="bg-white p-5 rounded-2xl border border-slate-200">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{status}</p>
                                            <h5 className="text-xl font-black text-slate-900 mt-1">{stat?.count || 0}</h5>
                                        </div>
                                    );
                                })}
                                <div className="bg-indigo-600 text-white p-5 rounded-2xl border border-indigo-500 shadow-md">
                                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Total Requests</p>
                                    <h5 className="text-xl font-black mt-1">
                                        {data.leaveStats.reduce((acc, curr) => acc + curr.count, 0)}
                                    </h5>
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
