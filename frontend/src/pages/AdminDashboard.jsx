import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus, Building2, X, Edit, Trash2, Search, Users,
    DollarSign, Calendar, TrendingUp, AlertCircle, RefreshCw, UserCheck,
    ChevronRight, ArrowUpRight, Plus
} from 'lucide-react';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../utils/employeeApi';
import { getAllDepartments, addDepartment, deleteDepartment, assignManager, removeManager } from '../utils/departmentApi';
import { getAllPayrolls } from '../utils/payrollApi';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState('overview');

    // Modal states
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // Data states
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Form states
    const [employeeForm, setEmployeeForm] = useState({
        employeeID: '', name: '', email: '', password: '',
        address: '', nic: '', position: '', salary: '', department: ''
    });
    const [departmentForm, setDepartmentForm] = useState({ departmentID: '', name: '' });
    const [managerForm, setManagerForm] = useState({ managerID: '' });

    // Statistics
    const [stats, setStats] = useState({
        totalEmployees: 0, totalDepartments: 0, monthlyPayroll: 0, pendingLeaves: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        filterEmployees();
    }, [searchTerm, employees]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [employeesData, departmentsData, payrollsData] = await Promise.all([
                getAllEmployees(),
                getAllDepartments(),
                getAllPayrolls()
            ]);

            setEmployees(employeesData || []);
            setDepartments(departmentsData?.departments || []);
            setPayrolls(payrollsData?.payrolls || []);

            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const currentYear = new Date().getFullYear();
            const monthlyPayroll = (payrollsData?.payrolls || [])
                .filter(p => p.month === currentMonth && p.year === currentYear)
                .reduce((sum, p) => sum + (p.netSalary || 0), 0);

            setStats({
                totalEmployees: employeesData?.length || 0,
                totalDepartments: departmentsData?.departments?.length || 0,
                monthlyPayroll: monthlyPayroll,
                pendingLeaves: 0
            });
        } catch (error) {
            showMessage('error', 'Failed to fetch data: ' + (error.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    const filterEmployees = () => {
        if (!searchTerm) {
            setFilteredEmployees(employees);
            return;
        }
        const filtered = employees.filter(emp =>
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDepartmentInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleManagerInputChange = (e) => {
        const { name, value } = e.target;
        setManagerForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.employeeID, employeeForm);
                showMessage('success', 'Employee updated successfully!');
            } else {
                await addEmployee(employeeForm);
                showMessage('success', 'Employee added successfully!');
            }
            setShowEmployeeModal(false);
            resetEmployeeForm();
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDepartment(departmentForm);
            showMessage('success', 'Department added successfully!');
            setShowDepartmentModal(false);
            resetDepartmentForm();
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to add department');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignManager = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await assignManager(selectedDepartment.departmentID, managerForm.managerID);
            showMessage('success', 'Manager assigned successfully');
            setShowManagerModal(false);
            resetManagerForm();
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to assign manager');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveManager = async (departmentID) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            setLoading(true);
            await removeManager(departmentID);
            showMessage('success', 'Manager removed successfully');
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to remove manager');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (employeeID) => {
        if (!window.confirm('Delete this employee?')) return;
        setLoading(true);
        try {
            await deleteEmployee(employeeID);
            showMessage('success', 'Employee deleted successfully!');
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        setLoading(true);
        try {
            await deleteDepartment(id);
            showMessage('success', 'Department deleted successfully!');
            fetchAllData();
        } catch (error) {
            showMessage('error', error.msg || 'Failed to delete department');
        } finally {
            setLoading(false);
        }
    };

    const openEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setEmployeeForm({
            employeeID: employee.employeeID || '',
            name: employee.name || '',
            email: employee.email || '',
            password: '',
            address: employee.address || '',
            nic: employee.nic || '',
            position: employee.position || '',
            salary: employee.salary || '',
            department: employee.department?._id || ''
        });
        setShowEmployeeModal(true);
    };

    const resetEmployeeForm = () => {
        setEditingEmployee(null);
        setEmployeeForm({
            employeeID: '', name: '', email: '', password: '',
            address: '', nic: '', position: '', salary: '', department: ''
        });
    };

    const resetDepartmentForm = () => setDepartmentForm({ departmentID: '', name: '' });
    const resetManagerForm = () => setManagerForm({ managerID: '' });

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

            <div className="flex-1 ml-72 p-8 pt-12 animate-fade-in relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-[var(--base-text)] mb-3">
                            System <span className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">Overview</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium">
                            Premium Management Suite • <span className="text-[var(--brand-primary)]">{new Date().toDateString()}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="glass p-1.5 rounded-2xl flex gap-1 border border-white/50">
                            {['overview', 'employees', 'departments'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab
                                        ? 'bg-[var(--brand-primary)] text-white shadow-lg'
                                        : 'text-gray-500 hover:bg-white/50'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={fetchAllData}
                            className="p-3 glass rounded-2xl hover:bg-white transition-all shadow-sm hover:shadow-md text-[var(--brand-primary)]"
                            title="Sync Data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-[var(--accent-success)] text-green-800' : 'border-[var(--accent-danger)] text-red-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <UserCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Content based on Active Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* Interactive Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Total Workforce', value: stats.totalEmployees, icon: Users, color: 'var(--brand-primary)' },
                                { label: 'Active Depts', value: stats.totalDepartments, icon: Building2, color: 'var(--brand-secondary)' },
                                { label: 'Pending Requests', value: stats.pendingLeaves, icon: Calendar, color: 'var(--accent-vibrant)' },
                                { label: 'Monthly Volume', value: formatCurrency(stats.monthlyPayroll), icon: DollarSign, color: 'var(--accent-success)' }
                            ].map((item, idx) => (
                                <div key={idx} className="glass group p-8 rounded-[2.5rem] hover-lift relative overflow-hidden bg-white/40">
                                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16`} style={{ backgroundColor: item.color }} />
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-4 bg-white shadow-inner rounded-2xl`} style={{ color: item.color }}>
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-[var(--accent-vibrant)] transition-colors" />
                                    </div>
                                    <h3 className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">{item.label}</h3>
                                    <p className="text-3xl font-black text-[var(--base-text)]">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Visual Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="glass p-10 rounded-[3rem] bg-white/40">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-[var(--base-text)] tracking-tight">Recent Arrivals</h2>
                                        <button onClick={() => setActiveTab('employees')} className="text-[var(--brand-primary)] font-bold text-sm hover:underline">View All Registry</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-widest border-b border-white/20">
                                                    <th className="pb-4 px-2">Identities</th>
                                                    <th className="pb-4 px-2">Positions</th>
                                                    <th className="pb-4 px-2 text-right">Compensation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {employees.slice(0, 4).map((emp) => (
                                                    <tr key={emp._id} className="group hover:bg-white/30 transition-colors">
                                                        <td className="py-5 px-2">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[var(--brand-primary)] shadow-inner">
                                                                    {emp.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-black text-[var(--base-text)]">{emp.name}</div>
                                                                    <div className="text-xs text-gray-400 font-bold">{emp.employeeID}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-2">
                                                            <div className="font-bold text-gray-600">{emp.position}</div>
                                                            <div className="text-xs text-[var(--accent-vibrant)] font-black uppercase tracking-tighter">{emp.department?.name || 'N/A'}</div>
                                                        </td>
                                                        <td className="py-5 px-2 text-right font-black text-[var(--base-text)]">
                                                            {formatCurrency(emp.salary || 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-8">
                                <section className="glass p-10 rounded-[3rem] bg-[var(--brand-primary)] text-white relative shadow-[0_20px_50px_rgba(79,70,229,0.35)] overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <Plus className="w-12 h-12 mb-6 opacity-30" />
                                    <h2 className="text-3xl font-black mb-4 leading-tight">Master <br />Controllers</h2>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => { resetEmployeeForm(); setShowEmployeeModal(true); }}
                                            className="w-full py-4 bg-white text-[var(--brand-primary)] font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Recruit Employee
                                        </button>
                                        <button
                                            onClick={() => setShowDepartmentModal(true)}
                                            className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3"
                                        >
                                            <Building2 className="w-5 h-5" />
                                            Establish Dept
                                        </button>
                                        <button
                                            onClick={() => navigate('/payroll')}
                                            className="w-full py-4 bg-[var(--accent-vibrant)] text-white font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3 shadow-lg shadow-[var(--accent-vibrant)]/30"
                                        >
                                            <DollarSign className="w-5 h-5" />
                                            Process Payroll
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'employees' && (
                    <section className="glass p-10 rounded-[3rem] animate-fade-in overflow-hidden bg-white/40">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                            <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter flex items-center gap-3">
                                <Users className="w-8 h-8 text-[var(--brand-primary)]" />
                                Workforce Registry
                            </h2>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by identity, position..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-none rounded-2xl focus:ring-4 focus:ring-[var(--brand-secondary)]/10 transition-all font-bold text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                                        <th className="px-6">Identity Card</th>
                                        <th className="px-6">Status Details</th>
                                        <th className="px-6 text-right">Compensation</th>
                                        <th className="px-6 text-center">Controls</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((emp) => (
                                        <tr key={emp._id} className="glass group hover:bg-white transition-all duration-300">
                                            <td className="px-6 py-6 rounded-l-[1.5rem]">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white border-2 border-[var(--base-foundation)] rounded-2xl flex items-center justify-center text-[var(--brand-primary)] font-black text-xl shadow-inner">
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-[var(--base-text)] text-lg">{emp.name}</div>
                                                        <div className="text-sm text-gray-500 font-bold">{emp.email} • {emp.employeeID}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-vibrant)]/10 text-[var(--accent-vibrant)] rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                                                    <div className="w-1.5 h-1.5 bg-[var(--accent-vibrant)] rounded-full animate-pulse" />
                                                    {emp.position}
                                                </div>
                                                <div className="text-xs text-[var(--brand-primary)]/80 font-black flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {emp.department?.name || 'GENERIC'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="text-xl font-black text-[var(--base-text)]">{formatCurrency(emp.salary || 0)}</div>
                                                <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Base Monthly</div>
                                            </td>
                                            <td className="px-6 py-6 rounded-r-[1.5rem] text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => openEditEmployee(emp)} className="p-3 bg-white text-[var(--brand-primary)] rounded-xl hover:bg-[var(--brand-primary)] hover:text-white transition-all shadow-sm">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteEmployee(emp.employeeID)} className="p-3 bg-white text-[var(--accent-danger)] rounded-xl hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'departments' && (
                    <section className="animate-fade-in">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter flex items-center gap-3">
                                <Building2 className="w-8 h-8 text-[var(--brand-primary)]" />
                                Departmental Structure
                            </h2>
                            <button onClick={() => setShowDepartmentModal(true)} className="px-8 py-4 bg-[var(--accent-vibrant)] text-white rounded-[1.5rem] font-black tracking-tight shadow-xl shadow-[var(--accent-vibrant)]/20 hover:scale-[1.05] transition-transform">
                                New Division
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {departments.map((dept) => {
                                const deptEmployees = employees.filter(emp => emp.department?._id === dept._id);
                                return (
                                    <div key={dept._id} className="glass group p-8 rounded-[3rem] border border-white/50 relative overflow-hidden active:scale-95 transition-all bg-white/40">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-16 h-16 glass bg-[var(--brand-primary)] shadow-xl rounded-[1.5rem] flex items-center justify-center text-white">
                                                <Building2 className="w-8 h-8" />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="px-4 py-2 bg-white/60 text-[var(--brand-primary)] rounded-2xl text-[10px] font-black tracking-widest shadow-inner">
                                                    {deptEmployees.length} POPULATION
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-[var(--base-text)] mb-2 leading-tight">{dept.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-8">ID // {dept.departmentID}</p>

                                        <div className="space-y-6">
                                            <div className="bg-white/50 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Division Manager</span>
                                                    {dept.manager && (
                                                        <button onClick={() => handleRemoveManager(dept.departmentID)} className="text-[10px] text-[var(--accent-danger)] font-black hover:underline tracking-tighter">DISCHARGE</button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dept.manager ? 'bg-[var(--brand-secondary)] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                        <UserCheck className="w-5 h-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className={`text-sm font-black truncate ${dept.manager ? 'text-[var(--base-text)]' : 'text-gray-400'}`}>
                                                            {dept.manager ? dept.manager.name : 'VACANT POSITION'}
                                                        </div>
                                                        {dept.manager && <div className="text-[10px] text-gray-400 font-bold">{dept.manager.employeeID}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => { setSelectedDepartment(dept); setShowManagerModal(true); }} className="px-4 py-3 bg-[var(--base-text)] text-white rounded-2xl font-black text-xs hover:bg-black transition-colors shadow-lg">
                                                    {dept.manager ? 'UPDATE' : 'APPOINT'}
                                                </button>
                                                <button onClick={() => handleDeleteDepartment(dept._id)} className="px-4 py-3 bg-white/50 text-[var(--accent-danger)] rounded-2xl font-black text-[10px] hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-sm">
                                                    DELETE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Restored Modals */}
            {showEmployeeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <div className="glass bg-white/95 rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white animate-scale-in">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-[var(--base-foundation)]">
                            <div>
                                <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">
                                    {editingEmployee ? 'Update Profile' : 'New Personnel'}
                                </h2>
                                <p className="text-sm font-bold text-gray-500">Employee Management System • Registry</p>
                            </div>
                            <button onClick={() => { setShowEmployeeModal(false); resetEmployeeForm(); }} className="p-3 bg-white shadow-md rounded-2xl text-gray-400 hover:text-[var(--accent-danger)] hover:rotate-90 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEmployeeSubmit} className="p-10 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'employeeID', label: 'Reference ID', type: 'text', disabled: !!editingEmployee, placeholder: 'EMP-XX' },
                                    { name: 'name', label: 'Full Identity', type: 'text', placeholder: 'Hideo Kojima' },
                                    { name: 'email', label: 'Communication Hub (Email)', type: 'email', placeholder: 'hideo@kojimaproductions.com' },
                                    ...(!editingEmployee ? [{ name: 'password', label: 'Secure Key (Password)', type: 'password', placeholder: '••••••••' }] : []),
                                    { name: 'nic', label: 'Gov ID / NIC', type: 'text', placeholder: '87342312V' },
                                    { name: 'position', label: 'Operation Role', type: 'text', placeholder: 'Director' },
                                    { name: 'salary', label: 'Base Compensation', type: 'number', placeholder: '99999' }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={employeeForm[field.name]}
                                            onChange={handleEmployeeInputChange}
                                            required={['employeeID', 'name', 'email', 'password', 'nic'].includes(field.name)}
                                            disabled={field.disabled}
                                            className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 placeholder-gray-300 shadow-inner"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Structural Unit</label>
                                    <select
                                        name="department"
                                        value={employeeForm.department}
                                        onChange={handleEmployeeInputChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner appearance-none"
                                    >
                                        <option value="">Select Division</option>
                                        {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                    </select>
                                </div>

                            </div>
                            <button type="submit" className="w-full mt-12 py-5 bg-[var(--base-text)] text-white rounded-[1.5rem] font-black tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-[0.98]">
                                {editingEmployee ? 'COMMIT CHANGES' : 'AUTHORIZE REGISTRY'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Department Modal */}
            {showDepartmentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <div className="glass bg-white/95 rounded-[3rem] max-w-md w-full p-10 animate-scale-in">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">Establishing <br />Unit</h2>
                            <button onClick={() => { setShowDepartmentModal(false); resetDepartmentForm(); }} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Division ID</label>
                                <input
                                    type="text"
                                    name="departmentID"
                                    value={departmentForm.departmentID}
                                    onChange={handleDepartmentInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Unit Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={departmentForm.name}
                                    onChange={handleDepartmentInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner"
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-[var(--brand-primary)] text-white rounded-[1.5rem] font-black tracking-widest shadow-xl hover:bg-[var(--brand-primary)]/90 transition-all">
                                CONFIRM UNIT
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Manager Appointment Modal */}
            {showManagerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <div className="glass bg-white/95 rounded-[3rem] max-w-md w-full p-10 animate-scale-in">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">Appointing <br />Command</h2>
                            <button onClick={() => setShowManagerModal(false)} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-8 border-l-4 border-[var(--brand-primary)] pl-4 bg-[var(--brand-primary)]/10 py-3 rounded-r-xl">
                            Assigning manager for <span className="text-[var(--brand-primary)]">"{selectedDepartment?.name}"</span>. Only employees currently within this division are eligible.
                        </p>
                        <form onSubmit={handleAssignManager} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Target Personnel ID</label>
                                <select
                                    name="managerID"
                                    value={managerForm.managerID}
                                    onChange={handleManagerInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner appearance-none"
                                >
                                    <option value="">SELECT ELIGIBLE PERSONNEL</option>
                                    {employees
                                        .filter(emp => emp.department?._id === selectedDepartment?._id)
                                        .map(emp => (
                                            <option key={emp._id} value={emp.employeeID}>{emp.name} ({emp.employeeID})</option>
                                        ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full py-5 bg-[var(--brand-primary)] text-white rounded-[1.5rem] font-black tracking-widest shadow-xl hover:bg-[var(--brand-primary)]/90 transition-all">
                                APPOINT MANAGER
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
