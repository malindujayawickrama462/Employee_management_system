import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { getEmployeeById } from '../utils/employeeApi';
import { generatePayroll, generateBulkPayroll, getAllPayrolls, downloadPayslip, deletePayroll } from '../utils/payrollApi';
import { DollarSign, Download, Search, Plus, Calendar, User, TrendingUp, Layers, Info, Trash2, ArrowUpRight, RefreshCw, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

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
            }, 500);
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await generatePayroll(formData);
            showMessage('success', 'Payroll generated successfully!');
            setShowForm(false);
            setFormData({
                employeeID: '', month: '', year: new Date().getFullYear(),
                baseSalary: '', allowances: 0, deductions: 0
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
        if (!window.confirm("Are you sure?")) return;
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
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-10 pt-12 animate-fade-in relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                            Payroll Management
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Monitor and manage employee compensation records
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <Layers className="w-4 h-4 text-indigo-600" />
                            Bulk Generation
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Add Record
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-xl shadow-sm animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                            <span className="font-bold text-sm">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl mb-10 flex items-center gap-4 border border-slate-200 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or month..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-3 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder-slate-300"
                        />
                    </div>
                    <button onClick={fetchPayrolls} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Single Payroll Form */}
                {showForm && (
                    <div className="bg-white p-10 rounded-[2.5rem] mb-12 animate-fade-in border border-slate-200 shadow-lg">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Generate Payroll</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Individual Record Entry</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-rose-600 transition-colors uppercase font-bold text-[10px] tracking-widest">Cancel</button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: 'employeeID', label: 'Employee ID', type: 'text', placeholder: 'EMP100' },
                                { name: 'month', label: 'Month', type: 'select', options: months },
                                { name: 'year', label: 'Year', type: 'number', placeholder: new Date().getFullYear() },
                                { name: 'baseSalary', label: 'Base Salary', type: 'number', placeholder: '0.00' },
                                { name: 'allowances', label: 'Allowances', type: 'number', placeholder: '0.00' },
                                { name: 'deductions', label: 'Deductions', type: 'number', placeholder: '0.00' }
                            ].map((field) => (
                                <div key={field.name} className="relative">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 appearance-none shadow-sm outline-none"
                                            >
                                                <option value="">Select Month</option>
                                                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                required={field.name !== 'allowances' && field.name !== 'deductions'}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none"
                                                placeholder={field.placeholder}
                                            />
                                            {field.name === 'employeeID' && isFetchingEmployee && (
                                                <RefreshCw className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="lg:col-span-3 pt-6 flex justify-end">
                                <button type="submit" disabled={loading} className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 text-xs uppercase">
                                    {loading ? 'Processing...' : 'Generate Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Records Section */}
                <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-indigo-600" />
                            Payroll History
                        </h2>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee</th>
                                    <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Period</th>
                                    <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Net Salary</th>
                                    <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && filteredPayrolls.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center font-bold text-slate-300 text-xs uppercase tracking-widest">Loading Records...</td></tr>
                                ) : filteredPayrolls.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center font-bold text-slate-300 text-xs uppercase tracking-widest">No records found</td></tr>
                                ) : (
                                    filteredPayrolls.map((p) => (
                                        <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg uppercase shadow-sm">
                                                        {p.employee?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{p.employee?.name || 'Unknown'}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{p.employee?.employeeID}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <Calendar className="w-4 h-4 text-slate-300" />
                                                    {p.month} {p.year}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="text-xl font-bold text-emerald-600">{formatCurrency(p.netSalary)}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleDownload(p)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100" title="Download Payslip">
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100" title="Delete record">
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
                </section>
            </div>

            {/* Bulk Generation Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bulk Generation</h2>
                            <button onClick={() => setShowBulkModal(false)} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="bg-indigo-50/50 p-6 rounded-2xl border-l-4 border-indigo-500 mb-8 flex gap-4">
                                <Info className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                                <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed">This will process payroll for all active employees for the specified month and year.</p>
                            </div>
                            <form onSubmit={handleBulkSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Month</label>
                                    <select
                                        value={bulkFormData.month}
                                        onChange={(e) => setBulkFormData({ ...bulkFormData, month: e.target.value })}
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm appearance-none outline-none"
                                    >
                                        <option value="">Select Month</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Year</label>
                                    <input
                                        type="number"
                                        value={bulkFormData.year}
                                        onChange={(e) => setBulkFormData({ ...bulkFormData, year: e.target.value })}
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase mt-4">
                                    {loading ? 'Processing...' : 'Run Mass Generation'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payroll;
