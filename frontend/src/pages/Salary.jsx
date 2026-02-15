import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmployeePayrolls, downloadPayslip } from '../utils/payrollApi';
import { DollarSign, Download, Calendar, TrendingUp, Wallet, BarChart3, ArrowUpRight, ChevronRight, RefreshCw } from 'lucide-react';

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
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 ml-72 p-8 pt-12 animate-fade-in relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
                            Financial <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Health</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium">
                            Earnings History • <span className="text-indigo-600">Premium Ledger</span>
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-green-500 text-green-800' : 'border-red-500 text-red-800'
                        }`}>
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'This Month', value: formatCurrency(stats.currentMonth), icon: Wallet, color: 'emerald' },
                        { label: 'Year To Date', value: formatCurrency(stats.ytdEarnings), icon: DollarSign, color: 'indigo' },
                        { label: 'Average Earnings', value: formatCurrency(stats.averageMonthly), icon: BarChart3, color: 'purple' }
                    ].map((item, idx) => (
                        <div key={idx} className="glass group p-8 rounded-[2.5rem] hover-lift relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/10 rounded-full blur-3xl -mr-16 -mt-16`} />
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 bg-white shadow-inner rounded-2xl text-${item.color}-600`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h3 className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">{item.label}</h3>
                            <p className="text-3xl font-black text-gray-900">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Salary History Table */}
                <section className="glass p-10 rounded-[3rem] animate-fade-in overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-indigo-600" />
                            Payroll Registry
                        </h2>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                                    <th className="px-6">Reporting Period</th>
                                    <th className="px-6 text-right">Accounting (Gross)</th>
                                    <th className="px-6 text-right">Net Value</th>
                                    <th className="px-6 text-center">Documentation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="w-12 h-12 text-indigo-200 animate-spin" />
                                                <span className="font-black text-gray-400 tracking-widest uppercase text-xs">Accessing Records...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : payrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <TrendingUp className="w-12 h-12 text-gray-200" />
                                                <span className="font-black text-gray-400 tracking-widest uppercase text-xs">No Financial History Detected</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payrolls.map((payroll) => (
                                        <tr key={payroll._id} className="glass group hover:bg-white transition-all duration-300">
                                            <td className="px-6 py-6 rounded-l-[1.5rem]">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner uppercase">
                                                        {payroll.month.substring(0, 3)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 text-lg">{payroll.month}</div>
                                                        <div className="text-sm text-gray-500 font-bold">Financial Year {payroll.year}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="text-gray-900 font-bold truncate">
                                                    <span className="text-xs text-gray-400 mr-2 uppercase tracking-tighter">Gross:</span>
                                                    {formatCurrency(payroll.grossSalary)}
                                                </div>
                                                <div className="text-[10px] text-red-400 font-black tracking-widest uppercase">
                                                    - {formatCurrency(payroll.tax)} Tax
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="text-2xl font-black text-emerald-600">{formatCurrency(payroll.netSalary)}</div>
                                                <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Cleared Funds</div>
                                            </td>
                                            <td className="px-6 py-6 rounded-r-[1.5rem] text-center">
                                                <button
                                                    onClick={() => handleDownload(payroll)}
                                                    className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group active:scale-95"
                                                >
                                                    <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                                                    PAYSHEET
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
