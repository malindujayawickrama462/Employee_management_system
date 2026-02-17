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

            // Format payroll trends for chart
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
        <div className="glass p-6 rounded-[2.5rem] border border-white/50 shadow-xl flex items-center gap-6 animate-fade-in hover:scale-[1.02] transition-transform">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1 italic tracking-tighter">{value}</h3>
            </div>
        </div>
    );

    if (loading) return <div className="flex-1 ml-72 p-8 flex items-center justify-center h-screen font-black uppercase tracking-widest text-indigo-600 animate-pulse">Initializing Data Protocols...</div>;

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 pt-12 max-h-screen overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                            Intelligence <span className="text-indigo-600">Reports</span>
                        </h1>
                        <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase mt-2">
                            Strategy • Data Analytics • Operational Insights
                        </p>
                    </div>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border border-indigo-100 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-100">
                        <Download className="w-4 h-4" />
                        Export Protocol
                    </button>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard title="Total Personnel" value={overview.totalEmployees} icon={Users} color="bg-indigo-600" />
                    <StatCard title="Divisions" value={overview.totalDepartments} icon={Building2} color="bg-purple-600" />
                    <StatCard title="Revenue Payout" value={`$${overview.totalPayout?.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" />
                    <StatCard title="Avg Performance" value={`${overview.avgPerformance?.toFixed(1)} / 5`} icon={TrendingUp} color="bg-amber-600" />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Department Distribution */}
                    <div className="glass p-10 rounded-[3rem] border border-white/50 shadow-2xl h-[450px]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-8 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Personnel Distribution by Division
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={deptData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900 }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Payroll Trends */}
                    <div className="glass p-10 rounded-[3rem] border border-white/50 shadow-2xl h-[450px]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-8 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Liquidity Disbursement Trends
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={payrollTrends}>
                                <defs>
                                    <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900 }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="payout" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorPayout)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Role Distribution */}
                    <div className="glass p-10 rounded-[3rem] border border-white/50 shadow-2xl h-[450px]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-8 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Personnel Protocol Allocation
                        </h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={roleDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Legend payload={roleDist.map((item, index) => ({ value: item.name, type: 'circle', color: COLORS[index % COLORS.length] }))} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Placeholder for Attendance Stats (Coming Soon) */}
                    <div className="glass p-10 rounded-[3rem] border border-white/50 shadow-2xl h-[450px] flex flex-col items-center justify-center text-center">
                        <Calendar className="w-16 h-16 text-indigo-100 mb-6" />
                        <h4 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Attendance <span className="text-indigo-600">Sync</span></h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-[250px]">
                            Daily attendance tracking and anomaly detection algorithms are being initialized.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
