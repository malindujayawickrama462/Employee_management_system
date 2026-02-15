import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmployeePayrolls, downloadPayslip } from '../utils/payrollApi';
import { DollarSign, Download, Calendar, TrendingUp, Wallet, BarChart3 } from 'lucide-react';

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

        // Current month salary
        const currentMonthData = data.find(p => p.year === currentYear && p.month === currentMonth);
        const currentMonthSalary = currentMonthData?.netSalary || 0;

        // YTD earnings
        const ytd = data
            .filter(p => p.year === currentYear)
            .reduce((sum, p) => sum + (p.netSalary || 0), 0);

        // Average monthly salary
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
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        My Salary
                    </h1>
                    <p className="text-gray-600">View your salary history and download payslips</p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg shadow-md animate-fade-in ${message.type === 'success'
                            ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
                            : 'bg-red-100 border-l-4 border-red-500 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <TrendingUp className="w-6 h-6 opacity-70" />
                        </div>
                        <h3 className="text-sm font-medium opacity-90 mb-1">Current Month</h3>
                        <p className="text-3xl font-bold">{formatCurrency(stats.currentMonth)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <Calendar className="w-6 h-6 opacity-70" />
                        </div>
                        <h3 className="text-sm font-medium opacity-90 mb-1">Year to Date</h3>
                        <p className="text-3xl font-bold">{formatCurrency(stats.ytdEarnings)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <BarChart3 className="w-8 h-8" />
                            </div>
                            <TrendingUp className="w-6 h-6 opacity-70" />
                        </div>
                        <h3 className="text-sm font-medium opacity-90 mb-1">Average Monthly</h3>
                        <p className="text-3xl font-bold">{formatCurrency(stats.averageMonthly)}</p>
                    </div>
                </div>

                {/* Salary History Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Salary History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Period</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Base Salary</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Allowances</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Deductions</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Gross Salary</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Tax</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Net Salary</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                Loading salary history...
                                            </div>
                                        </td>
                                    </tr>
                                ) : payrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <DollarSign className="w-16 h-16 text-gray-300" />
                                                <p className="text-gray-500 text-lg">No salary records found</p>
                                                <p className="text-gray-400 text-sm">Your salary history will appear here once payroll is generated</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payrolls.map((payroll) => (
                                        <tr
                                            key={payroll._id}
                                            className="hover:bg-indigo-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                    {payroll.month} {payroll.year}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">
                                                {formatCurrency(payroll.baseSalary)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-green-600 font-medium">
                                                +{formatCurrency(payroll.allowances)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-red-600 font-medium">
                                                -{formatCurrency(payroll.deductions)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {formatCurrency(payroll.grossSalary)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-orange-600 font-medium">
                                                -{formatCurrency(payroll.tax)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="font-bold text-green-600 text-lg">
                                                        {formatCurrency(payroll.netSalary)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDownload(payroll)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
                </div>
            </div>
        </div>
    );
};

export default Salary;
