import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getEmployeeById } from '../utils/employeeApi';
import { generatePayroll, generateBulkPayroll, getAllPayrolls, downloadPayslip, deletePayroll } from '../utils/payrollApi';
import { DollarSign, Download, Search, Plus, Calendar, User, TrendingUp, Layers, Info, Trash2 } from 'lucide-react';

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [filteredPayrolls, setFilteredPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        employeeID: '',
        month: '',
        year: new Date().getFullYear(),
        baseSalary: '',
        allowances: 0,
        deductions: 0
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkFormData, setBulkFormData] = useState({
        month: '',
        year: new Date().getFullYear()
    });
    const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        fetchPayrolls();
    }, []);

    useEffect(() => {
        filterPayrolls();
    }, [searchTerm, payrolls]);

    useEffect(() => {
        if (formData.employeeID.length >= 3) {
            const timer = setTimeout(() => {
                fetchEmployeeSalary(formData.employeeID);
            }, 500); // Debounce to avoid excessive API calls
            return () => clearTimeout(timer);
        }
    }, [formData.employeeID]);

    const fetchEmployeeSalary = async (id) => {
        try {
            setIsFetchingEmployee(true);
            const employee = await getEmployeeById(id);
            if (employee && employee.salary) {
                setFormData(prev => ({
                    ...prev,
                    baseSalary: employee.salary
                }));
            }
        } catch (error) {
            console.error("Error fetching employee salary:", error);
            // Don't show error message here to avoid annoying user while typing
        } finally {
            setIsFetchingEmployee(false);
        }
    };

    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const response = await getAllPayrolls();
            setPayrolls(response.payrolls || []);
        } catch (error) {
            showMessage('error', 'Failed to fetch payroll records');
        } finally {
            setLoading(false);
        }
    };

    const filterPayrolls = () => {
        if (!searchTerm) {
            setFilteredPayrolls(payrolls);
            return;
        }
        const filtered = payrolls.filter(payroll =>
            payroll.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payroll.employee?.employeeID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payroll.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payroll.year?.toString().includes(searchTerm)
        );
        setFilteredPayrolls(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await generatePayroll(formData);
            showMessage('success', 'Payroll generated successfully!');
            setShowForm(false);
            setFormData({
                employeeID: '',
                month: '',
                year: new Date().getFullYear(),
                baseSalary: '',
                allowances: 0,
                deductions: 0
            });
            fetchPayrolls();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to generate payroll');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await generateBulkPayroll(bulkFormData.month, bulkFormData.year);
            showMessage('success', response.msg || 'Bulk payroll generated successfully!');
            setShowBulkModal(false);
            fetchPayrolls();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to generate bulk payroll');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (payroll) => {
        try {
            await downloadPayslip(
                payroll._id,
                payroll.employee.name,
                payroll.month,
                payroll.year
            );
            showMessage('success', 'Payslip downloaded successfully!');
        } catch (error) {
            showMessage('error', 'Failed to download payslip');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payroll record?")) return;

        setLoading(true);
        try {
            await deletePayroll(id);
            showMessage('success', 'Payroll record deleted successfully');
            fetchPayrolls();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to delete payroll record');
        } finally {
            setLoading(false);
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
                        Payroll Management
                    </h1>
                    <p className="text-gray-600">Generate and manage employee payroll records</p>
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

                {/* Action Bar */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by employee name, ID, month, or year..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-semibold"
                        >
                            <Layers className="w-5 h-5" />
                            Bulk Generate
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Single Payroll
                        </button>
                    </div>
                </div>

                {/* Payroll Generation Form */}
                {showForm && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-indigo-100 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-indigo-600" />
                            Generate New Payroll
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employee ID *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="employeeID"
                                        value={formData.employeeID}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., EMP001"
                                    />
                                    {isFetchingEmployee && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                {formData.baseSalary > 0 && !isFetchingEmployee && (
                                    <p className="text-[10px] text-green-600 mt-1 font-medium animate-fade-in">
                                        ✓ Salary details auto-filled from profile
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Month *
                                </label>
                                <select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select Month</option>
                                    {months.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year *
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    min="2000"
                                    max="2100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Base Salary *
                                </label>
                                <input
                                    type="number"
                                    name="baseSalary"
                                    value={formData.baseSalary}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allowances
                                </label>
                                <input
                                    type="number"
                                    name="allowances"
                                    value={formData.allowances}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deductions
                                </label>
                                <input
                                    type="number"
                                    name="deductions"
                                    value={formData.deductions}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    {loading ? 'Generating...' : 'Generate Payroll'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payroll Records Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Period</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Base Salary</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Allowances</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Deductions</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Gross Salary</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Tax</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Net Salary</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                Loading payroll records...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPayrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            No payroll records found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayrolls.map((payroll, index) => (
                                        <tr
                                            key={payroll._id}
                                            className="hover:bg-indigo-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {payroll.employee?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {payroll.employee?.employeeID || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                    {payroll.month} {payroll.year}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700">
                                                {formatCurrency(payroll.baseSalary)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-green-600">
                                                +{formatCurrency(payroll.allowances)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-red-600">
                                                -{formatCurrency(payroll.deductions)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {formatCurrency(payroll.grossSalary)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-orange-600">
                                                -{formatCurrency(payroll.tax)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="font-bold text-green-600">
                                                        {formatCurrency(payroll.netSalary)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(payroll)}
                                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                        title="Download Payslip"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(payroll._id)}
                                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Bulk Payroll Modal */}
                {showBulkModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Layers className="w-6 h-6" />
                                    Generate Bulk Payroll
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">Generate payroll for all employees at once.</p>
                            </div>
                            <form onSubmit={handleBulkSubmit} className="p-6 space-y-4">
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 text-indigo-700 text-sm">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <p>Existing records for the chosen period will be skipped automatically.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                                    <select
                                        value={bulkFormData.month}
                                        onChange={(e) => setBulkFormData({ ...bulkFormData, month: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Month</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                    <input
                                        type="number"
                                        value={bulkFormData.year}
                                        onChange={(e) => setBulkFormData({ ...bulkFormData, year: e.target.value })}
                                        required
                                        min="2000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkModal(false)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 font-medium"
                                    >
                                        {loading ? 'Processing...' : 'Run Generation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
