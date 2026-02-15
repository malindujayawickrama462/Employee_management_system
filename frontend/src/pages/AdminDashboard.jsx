import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus, Building2, X, Edit, Trash2, Search, Users,
    DollarSign, Calendar, TrendingUp, AlertCircle, RefreshCw, UserCheck
} from 'lucide-react';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../utils/employeeApi';
import { getAllDepartments, addDepartment, deleteDepartment, assignManager, removeManager } from '../utils/departmentApi';
import { getAllPayrolls } from '../utils/payrollApi';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
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
        employeeID: '',
        name: '',
        email: '',
        password: '',
        address: '',
        nic: '',
        position: '',
        salary: '',
        department: ''
    });
    const [departmentForm, setDepartmentForm] = useState({
        departmentID: '',
        name: ''
    });
    const [managerForm, setManagerForm] = useState({
        managerID: ''
    });

    // Statistics
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        monthlyPayroll: 0,
        pendingLeaves: 0
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

            // Calculate statistics
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDepartmentInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleManagerInputChange = (e) => {
        const { name, value } = e.target;
        setManagerForm(prev => ({
            ...prev,
            [name]: value
        }));
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
        if (!window.confirm("Are you sure you want to remove the manager from this department?")) return;

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
        if (!window.confirm('Are you sure you want to delete this employee?')) return;

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
        if (!window.confirm('Are you sure you want to delete this department?')) return;

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
            password: '', // Password shouldn't be fetched or edited here usually
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
            employeeID: '',
            name: '',
            email: '',
            password: '',
            address: '',
            nic: '',
            position: '',
            salary: '',
            department: ''
        });
    };

    const resetDepartmentForm = () => {
        setDepartmentForm({
            departmentID: '',
            name: ''
        });
    };

    const resetManagerForm = () => {
        setManagerForm({
            managerID: ''
        });
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">Welcome, <span className="font-bold">{user?.name}</span>!</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchAllData}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md border border-gray-200"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md"
                        >
                            Logout
                        </button>
                    </div>
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

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'overview'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-gray-600 hover:text-indigo-600'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'employees'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-gray-600 hover:text-indigo-600'
                            }`}
                    >
                        Employees
                    </button>
                    <button
                        onClick={() => setActiveTab('departments')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'departments'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-gray-600 hover:text-indigo-600'
                            }`}
                    >
                        Departments
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <TrendingUp className="w-6 h-6 opacity-70" />
                                </div>
                                <h3 className="text-sm font-medium opacity-90 mb-1">Total Employees</h3>
                                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <TrendingUp className="w-6 h-6 opacity-70" />
                                </div>
                                <h3 className="text-sm font-medium opacity-90 mb-1">Total Departments</h3>
                                <p className="text-3xl font-bold">{stats.totalDepartments}</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <AlertCircle className="w-6 h-6 opacity-70" />
                                </div>
                                <h3 className="text-sm font-medium opacity-90 mb-1">Pending Leaves</h3>
                                <p className="text-3xl font-bold">{stats.pendingLeaves}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                        <DollarSign className="w-8 h-8" />
                                    </div>
                                    <TrendingUp className="w-6 h-6 opacity-70" />
                                </div>
                                <h3 className="text-sm font-medium opacity-90 mb-1">Monthly Payroll</h3>
                                <p className="text-3xl font-bold">{formatCurrency(stats.monthlyPayroll)}</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => {
                                        resetEmployeeForm();
                                        setShowEmployeeModal(true);
                                    }}
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <UserPlus className="w-6 h-6" />
                                    <span className="font-medium">Add New Employee</span>
                                </button>
                                <button
                                    onClick={() => navigate('/payroll')}
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <DollarSign className="w-6 h-6" />
                                    <span className="font-medium">Manage Payroll</span>
                                </button>
                                <button
                                    onClick={() => setShowDepartmentModal(true)}
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Building2 className="w-6 h-6" />
                                    <span className="font-medium">Add Department</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Employees */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Employees</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {employees.slice(0, 5).map((emp) => (
                                            <tr key={emp._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{emp.employeeID}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{emp.department?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(emp.salary || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Employees Tab */}
                {activeTab === 'employees' && (
                    <div>
                        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    resetEmployeeForm();
                                    setShowEmployeeModal(true);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                            >
                                <UserPlus className="w-5 h-5" />
                                Add Employee
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Employee ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Salary</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                        Loading...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    No employees found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEmployees.map((emp) => (
                                                <tr key={emp._id} className="hover:bg-indigo-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.employeeID}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{emp.department?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(emp.salary || 0)}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openEditEmployee(emp)}
                                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEmployee(emp.employeeID)}
                                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                    </div>
                )}

                {/* Departments Tab */}
                {activeTab === 'departments' && (
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
                            <button
                                onClick={() => setShowDepartmentModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                            >
                                <Building2 className="w-5 h-5" />
                                Add Department
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept) => {
                                const deptEmployees = employees.filter(emp => emp.department?._id === dept._id);
                                return (
                                    <div key={dept._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-indigo-100 rounded-lg">
                                                <Building2 className="w-8 h-8 text-indigo-600" />
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                                    {deptEmployees.length} employees
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteDepartment(dept._id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{dept.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4">ID: {dept.departmentID}</p>
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager</span>
                                                    {dept.manager && (
                                                        <button
                                                            onClick={() => handleRemoveManager(dept.departmentID)}
                                                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                                                        >
                                                            Unassign
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-md ${dept.manager ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        <UserCheck className="w-4 h-4" />
                                                    </div>
                                                    <span className={`text-sm font-medium ${dept.manager ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {dept.manager ? dept.manager.name : 'Not assigned'}
                                                    </span>
                                                </div>
                                                {dept.manager && (
                                                    <span className="text-[10px] text-gray-400 mt-1 block">ID: {dept.manager.employeeID}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDepartment(dept);
                                                        setShowManagerModal(true);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    {dept.manager ? 'Change' : 'Assign'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDepartment(dept._id)}
                                                    className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Delete Department"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Employee Modal */}
                {showEmployeeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowEmployeeModal(false);
                                        resetEmployeeForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleEmployeeSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Employee ID *
                                        </label>
                                        <input
                                            type="text"
                                            name="employeeID"
                                            value={employeeForm.employeeID}
                                            onChange={handleEmployeeInputChange}
                                            required
                                            disabled={editingEmployee !== null}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                            placeholder="e.g., EMP001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={employeeForm.name}
                                            onChange={handleEmployeeInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={employeeForm.email}
                                            onChange={handleEmployeeInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {!editingEmployee && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Login Password *
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={employeeForm.password}
                                                onChange={handleEmployeeInputChange}
                                                required={!editingEmployee}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIC *
                                        </label>
                                        <input
                                            type="text"
                                            name="nic"
                                            value={employeeForm.nic}
                                            onChange={handleEmployeeInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="123456789V"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            value={employeeForm.position}
                                            onChange={handleEmployeeInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary
                                        </label>
                                        <input
                                            type="number"
                                            name="salary"
                                            value={employeeForm.salary}
                                            onChange={handleEmployeeInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            value={employeeForm.department}
                                            onChange={handleEmployeeInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                                            ))}
                                        </select>
                                        {departments.length === 0 && (
                                            <p className="mt-1 text-sm text-orange-600">
                                                No departments available. Please add a department first.
                                            </p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={employeeForm.address}
                                            onChange={handleEmployeeInputChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="123 Main Street, City"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEmployeeModal(false);
                                            resetEmployeeForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Department Modal */}
                {showDepartmentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Add New Department</h2>
                                <button
                                    onClick={() => {
                                        setShowDepartmentModal(false);
                                        resetDepartmentForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleDepartmentSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department ID *
                                        </label>
                                        <input
                                            type="text"
                                            name="departmentID"
                                            value={departmentForm.departmentID}
                                            onChange={handleDepartmentInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="e.g., DEPT001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={departmentForm.name}
                                            onChange={handleDepartmentInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="e.g., Engineering"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDepartmentModal(false);
                                            resetDepartmentForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {loading ? 'Adding...' : 'Add Department'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Manager Assignment Modal */}
                {showManagerModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Assign Manager</h2>
                                <button
                                    onClick={() => {
                                        setShowManagerModal(false);
                                        setSelectedDepartment(null);
                                        resetManagerForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAssignManager} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-4 text-sm text-gray-600">
                                            Assign a manager to the <span className="font-bold text-indigo-600">{selectedDepartment?.name}</span> department.
                                        </p>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Manager (Employee) *
                                        </label>
                                        <select
                                            name="managerID"
                                            value={managerForm.managerID}
                                            onChange={handleManagerInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select an Employee</option>
                                            {employees
                                                .filter(emp => emp.department?._id === selectedDepartment?._id)
                                                .map(emp => (
                                                    <option key={emp._id} value={emp.employeeID}>
                                                        {emp.name} ({emp.employeeID})
                                                    </option>
                                                ))}
                                        </select>
                                        {employees.filter(emp => emp.department?._id === selectedDepartment?._id).length === 0 && (
                                            <p className="mt-2 text-sm text-orange-600">
                                                No employees found in this department. A manager must be an employee of the department.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowManagerModal(false);
                                            setSelectedDepartment(null);
                                            resetManagerForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || employees.filter(emp => emp.department?._id === selectedDepartment?._id).length === 0}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {loading ? 'Assigning...' : 'Assign Manager'}
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

export default AdminDashboard;
