import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmployeePayrolls, downloadPayslip } from '../utils/payrollApi';
import { DollarSign, Download, Calendar, TrendingUp, Wallet, BarChart3, ArrowUpRight, ChevronRight, RefreshCw, PoundSign } from 'lucide-react';

const Salary = () => {
    const { user } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        currentMonth: 0,
        ytdEarnings: 0,
        averageMonthly: 0
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.employeeID) {
            fetchSalaryHistory();
        }
    }, [user]);

    const fetchSalaryHistory = async () => {
        setLoading(true);
        try {
            const response = await getEmployeePayrolls(user.employeeID);
            const salaryData = response.payrolls || [];
            setPayrolls(salaryData);
            calculateStats(salaryData);
        } catch (error) {
            showMessage('error', error.msg || 'Failed to fetch salary history');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        if (data.length === 0) {
            setStats({ currentMonth: 0, ytdEarnings: 0, averageMonthly: 0 });
            return;
        }

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });

        const currentMonthData = data.find(p => p.year === currentYear && p.month === currentMonth);
        const currentMonthSalary = currentMonthData?.netSalary || 0;

        const ytd = data
            .filter(p => p.year === currentYear)
            .reduce((sum, p) => sum + (p.netSalary || 0), 0);

        const average = data.length > 0
            ? data.reduce((sum, p) => sum + (p.netSalary || 0), 0) / data.length
            : 0;

        setStats({
            currentMonth: currentMonthSalary,
            ytdEarnings: ytd,
            averageMonthly: average
        });
    };

    const handleDownload = async (payroll) => {
        try {
            await downloadPayslip(
                payroll._id,
                user.name,
                payroll.month,
                payroll.year
            );
            showMessage('success', 'Payslip downloaded successfully!');
        } catch (error) {
            showMessage('error', 'Failed to download payslip');
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-72 p-8 pt-12 animate-fade-in relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Salary & Payroll</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">View your monthly earnings and download payslips</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-xl shadow-sm animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                        }`}>
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Current Month', value: formatCurrency(stats.currentMonth), icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Year To Date', value: formatCurrency(stats.ytdEarnings), icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Avg Monthly', value: formatCurrency(stats.averageMonthly), icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 ${item.bg} rounded-2xl ${item.color}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-300" />
                            </div>
                            <h3 className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-1">{item.label}</h3>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Salary History Table */}
                <section className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            Salary History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Month / Year</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Gross Salary</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Net Salary</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <RefreshCw className="w-10 h-10 text-indigo-100 animate-spin mx-auto mb-4" />
                                            <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Loading Records...</span>
                                        </td>
                                    </tr>
                                ) : payrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <p className="font-bold text-slate-400 text-sm">No payroll records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    payrolls.map((payroll) => (
                                        <tr key={payroll._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
                                                        {payroll.month.substring(0, 3)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{payroll.month}</div>
                                                        <div className="text-xs text-slate-400 font-medium">Year {payroll.year}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-slate-600 font-bold text-sm">
                                                    {formatCurrency(payroll.grossSalary)}
                                                </div>
                                                <div className="text-[10px] text-rose-400 font-bold tracking-tight">
                                                    - {formatCurrency(payroll.tax)} Tax
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-xl font-bold text-emerald-600">{formatCurrency(payroll.netSalary)}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => handleDownload(payroll)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Salary;
