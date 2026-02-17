import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, Building2, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';
import { getOverviewStats, getDepartmentStats, getPayrollTrends, getRoleDistribution } from '../utils/analyticsApi';

const Analytics = () => {
    const [overview, setOverview] = useState({});
    const [deptData, setDeptData] = useState([]);
    const [payrollTrends, setPayrollTrends] = useState([]);
    const [roleDist, setRoleDist] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [overviewRes, deptRes, payrollRes, roleRes] = await Promise.all([
                getOverviewStats(),
                getDepartmentStats(),
                getPayrollTrends(),
                getRoleDistribution()
            ]);
            setOverview(overviewRes);
            setDeptData(deptRes.data);

            const formattedPayroll = payrollRes.data.map(item => ({
                name: `${item._id.month} ${item._id.year}`,
                payout: item.total
            }));
            setPayrollTrends(formattedPayroll);

            setRoleDist(roleRes.data.map(item => ({ name: item._id, value: item.count })));
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-6 animate-fade-in hover:shadow-md transition-all">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
            </div>
        </div>
    );

    if (loading) return <div className="flex-1 ml-72 p-8 flex items-center justify-center h-screen font-bold uppercase tracking-widest text-indigo-600 animate-pulse">Loading Analytics...</div>;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 pt-12 max-h-screen overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Analytics Overview
                        </h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                            System Data & Performance Metrics
                        </p>
                    </div>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Employees" value={overview.totalEmployees} icon={Users} color="bg-indigo-600" />
                    <StatCard title="Departments" value={overview.totalDepartments} icon={Building2} color="bg-purple-600" />
                    <StatCard title="Total Payroll" value={`$${overview.totalPayout?.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" />
                    <StatCard title="Avg Performance" value={`${overview.avgPerformance?.toFixed(1)} / 5`} icon={TrendingUp} color="bg-amber-600" />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Department Distribution */}
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[450px]">
                        <h4 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600" /> Employees by Department
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={deptData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 0, 0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Payroll Trends */}
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[450px]">
                        <h4 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-indigo-600" /> Monthly Payroll Trends
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={payrollTrends}>
                                <defs>
                                    <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Area type="monotone" dataKey="payout" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorPayout)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Role Distribution */}
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[450px]">
                        <h4 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" /> Employee Roles
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={roleDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Placeholder for Attendance Stats */}
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[450px] flex flex-col items-center justify-center text-center">
                        <Calendar className="w-16 h-16 text-slate-100 mb-6" />
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Tracking</h4>
                        <p className="text-xs font-medium text-slate-400 mt-2 max-w-[280px]">
                            Daily attendance tracking and reporting features are under development.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
