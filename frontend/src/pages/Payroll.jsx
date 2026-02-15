import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { getEmployeeById } from '../utils/employeeApi';
import { generatePayroll, generateBulkPayroll, getAllPayrolls, downloadPayslip, deletePayroll } from '../utils/payrollApi';
import { DollarSign, Download, Search, Plus, Calendar, User, TrendingUp, Layers, Info, Trash2, ArrowUpRight, RefreshCw, ChevronRight } from 'lucide-react';

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
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-10 pt-12 animate-fade-in relative transition-all duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
                            Payroll <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Operations</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium">
                            Financial Logistics • <span className="text-indigo-600">Enterprise Ledger</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3.5 glass bg-white/50 text-indigo-600 font-black text-sm rounded-2xl hover:bg-white transition-all shadow-sm hover:translate-y-[-2px] tracking-tight uppercase"
                        >
                            <Layers className="w-5 h-5 text-indigo-500" />
                            Bulk Generation
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-black transition-all shadow-xl hover:translate-y-[-2px] tracking-tight uppercase"
                        >
                            <Plus className="w-5 h-5" />
                            Single Record
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-green-500 text-green-800' : 'border-red-500 text-red-800'
                        }`}>
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                {/* Search Bar */}
                <div className="glass p-4 rounded-3xl mb-10 flex items-center gap-4 border border-white/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find records by name, ID, or period..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:ring-0 font-bold text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button onClick={fetchPayrolls} className="p-4 text-indigo-600 hover:bg-white/50 rounded-2xl transition-all">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Single Payroll Form */}
                {showForm && (
                    <div className="glass p-10 rounded-[3rem] mb-12 animate-fade-in border border-indigo-100 shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                                <Plus className="w-8 h-8 text-indigo-600" />
                                Individual Generation
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition-colors uppercase font-black text-xs tracking-widest">Discard Form</button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: 'employeeID', label: 'Identity Reference', type: 'text', placeholder: 'EMP-XX' },
                                { name: 'month', label: 'Accounting Month', type: 'select', options: months },
                                { name: 'year', label: 'Financial Year', type: 'number', placeholder: new Date().getFullYear() },
                                { name: 'baseSalary', label: 'Base Calculation', type: 'number', placeholder: '0.00' },
                                { name: 'allowances', label: 'Bonus / Allowances', type: 'number', placeholder: '0.00' },
                                { name: 'deductions', label: 'System Deductions', type: 'number', placeholder: '0.00' }
                            ].map((field) => (
                                <div key={field.name} className="relative">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 appearance-none shadow-inner"
                                        >
                                            <option value="">Choose Month</option>
                                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                required={field.name !== 'allowances' && field.name !== 'deductions'}
                                                className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner"
                                                placeholder={field.placeholder}
                                            />
                                            {field.name === 'employeeID' && isFetchingEmployee && (
                                                <RefreshCw className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="lg:col-span-3 pt-6 border-t border-gray-100 flex justify-end gap-4">
                                <button type="submit" disabled={loading} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? 'PROCESSING...' : 'AUTHORIZE GENERATION'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Records Section */}
                <section className="glass p-10 rounded-[3rem] animate-fade-in overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-indigo-600" />
                            Financial Ledger
                        </h2>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                                    <th className="px-6">Personnel Info</th>
                                    <th className="px-6">Billing Cycle</th>
                                    <th className="px-6 text-right">Accounting (Net)</th>
                                    <th className="px-6 text-center">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && filteredPayrolls.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center font-black text-gray-300 uppercase tracking-widest">Syncing Records...</td></tr>
                                ) : filteredPayrolls.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center font-black text-gray-300 uppercase tracking-widest text-xs">No Records Located</td></tr>
                                ) : (
                                    filteredPayrolls.map((p) => (
                                        <tr key={p._id} className="glass group hover:bg-white transition-all duration-300">
                                            <td className="px-6 py-6 rounded-l-[1.5rem]">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner uppercase">
                                                        {p.employee?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 text-lg">{p.employee?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{p.employee?.employeeID}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-black text-gray-600 uppercase text-xs tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                                    {p.month} {p.year}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="text-2xl font-black text-emerald-600">{formatCurrency(p.netSalary)}</div>
                                                <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Validated Transaction</div>
                                            </td>
                                            <td className="px-6 py-6 rounded-r-[1.5rem] text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => handleDownload(p)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(p._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-gray-800">
                    <div className="glass bg-white/95 rounded-[3rem] max-w-md w-full p-12 animate-scale-in">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Mass <br />Execution</h2>
                            <button onClick={() => setShowBulkModal(false)} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <div className="bg-indigo-50/50 p-6 rounded-3x border-l-4 border-indigo-500 mb-8 flex gap-4">
                            <Info className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                            <p className="text-xs font-bold text-gray-500 uppercase leading-loose">This will process all active workforce identities for the specified billing cycle. Duplicates will be rejected.</p>
                        </div>
                        <form onSubmit={handleBulkSubmit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Target Cycle Month</label>
                                <select
                                    value={bulkFormData.month}
                                    onChange={(e) => setBulkFormData({ ...bulkFormData, month: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-[1.5rem] font-black text-gray-700 shadow-inner appearance-none"
                                >
                                    <option value="">SELECT MONTH</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Deployment Year</label>
                                <input
                                    type="number"
                                    value={bulkFormData.year}
                                    onChange={(e) => setBulkFormData({ ...bulkFormData, year: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-[1.5rem] font-black text-gray-700 shadow-inner"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black tracking-widest shadow-2xl hover:bg-black transition-all">
                                {loading ? 'PROCESSING...' : 'RUN MASS GENERATION'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payroll;
