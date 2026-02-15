/**
 * AdminDashboard.jsx - Central Management Hub for Administrators
 * 
 * This component serves as the primary interface for system admins. It manages:
 * 1. Unified data fetching (Employees, Departments, Payroll).
 * 2. Role-based view switching via tabs (Overview, Registry, Structure).
 * 3. Lifecycle management for employees and departments (Add/Edit/Delete).
 * 4. Permission delegation (Assigning/Removing Managers).
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, AlertCircle } from 'lucide-react';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../utils/employeeApi';
import { getAllDepartments, addDepartment, deleteDepartment, assignManager, removeManager } from '../utils/departmentApi';
import { getAllPayrolls } from '../utils/payrollApi';
import AdminSidebar from '../components/AdminSidebar';

// Modular components for different dashboard sections
import DashboardHeader from '../components/DashboardHeader';
import StatsGrid from '../components/StatsGrid';
import RecentArrivals from '../components/RecentArrivals';
import QuickActions from '../components/QuickActions';
import EmployeeRegistry from '../components/EmployeeRegistry';
import DepartmentStructure from '../components/DepartmentStructure';
import EmployeeModal from '../components/EmployeeModal';
import DepartmentModal from '../components/DepartmentModal';
import ManagerModal from '../components/ManagerModal';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // -- Component State --
    const [activeTab, setActiveTab] = useState('overview'); // Controls visible content section
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // -- Data State --
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // Global notification state

    // -- Search & Filtering --
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // -- Form Buffer States --
    const [employeeForm, setEmployeeForm] = useState({
        employeeID: '', name: '', email: '', password: '',
        address: '', nic: '', position: '', salary: '', department: ''
    });
    const [departmentForm, setDepartmentForm] = useState({ departmentID: '', name: '' });
    const [managerForm, setManagerForm] = useState({ managerID: '' });

    // -- Aggregate Stats --
    const [stats, setStats] = useState({
        totalEmployees: 0, totalDepartments: 0, monthlyPayroll: 0, pendingLeaves: 0
    });

    /**
     * Initial Data Load
     */
    useEffect(() => {
        fetchAllData();
    }, []);

    /**
     * Client-side search filtering
     */
    useEffect(() => {
        filterEmployees();
    }, [searchTerm, employees]);

    /**
     * fetchAllData - Orchestrates parallel API calls to populate the dashboard stats and registry.
     */
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

            // Calculate current month's payroll aggregate
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

    /**
     * filterEmployees - Performs a fuzzy search across multiple employee attributes.
     */
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

    // -- CRUD Handlers --

    /**
     * handleEmployeeSubmit - Handles both 'Create' and 'Update' operations for employees.
     */
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
            fetchAllData(); // Refresh list
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

    /**
     * handleAssignManager - Links an employee identity to a department as its manager.
     */
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

    // -- UI Helper Functions --

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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

    /**
     * openEditEmployee - Populates the form buffer with existing data for editing.
     */
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

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 ml-72 p-8 pt-12 animate-fade-in relative">
                {/* Header Section: Tab Switching & Force Refresh */}
                <DashboardHeader
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    loading={loading}
                    fetchAllData={fetchAllData}
                />

                {/* Notifications */}
                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-[var(--accent-success)] text-green-800' : 'border-[var(--accent-danger)] text-red-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <UserCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Main Dynamic Content Area */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* High-level performance metrics */}
                        <StatsGrid stats={stats} formatCurrency={formatCurrency} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Chronological list of new personnel */}
                                <RecentArrivals
                                    employees={employees}
                                    setActiveTab={setActiveTab}
                                    formatCurrency={formatCurrency}
                                />
                            </div>
                            <div className="space-y-8">
                                {/* One-click access to critical forms */}
                                <QuickActions
                                    resetEmployeeForm={resetEmployeeForm}
                                    setShowEmployeeModal={setShowEmployeeModal}
                                    setShowDepartmentModal={setShowDepartmentModal}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'employees' && (
                    <EmployeeRegistry
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredEmployees={filteredEmployees}
                        openEditEmployee={openEditEmployee}
                        handleDeleteEmployee={handleDeleteEmployee}
                        formatCurrency={formatCurrency}
                    />
                )}

                {activeTab === 'departments' && (
                    <DepartmentStructure
                        departments={departments}
                        employees={employees}
                        setShowDepartmentModal={setShowDepartmentModal}
                        handleRemoveManager={handleRemoveManager}
                        setSelectedDepartment={setSelectedDepartment}
                        setShowManagerModal={setShowManagerModal}
                        handleDeleteDepartment={handleDeleteDepartment}
                    />
                )}
            </div>

            {/* Modal Layers - Rendered outside main flow to avoid z-index conflicts */}

            {/* Employee Add/Edit Portal */}
            <EmployeeModal
                showEmployeeModal={showEmployeeModal}
                setShowEmployeeModal={setShowEmployeeModal}
                editingEmployee={editingEmployee}
                employeeForm={employeeForm}
                handleEmployeeInputChange={handleEmployeeInputChange}
                handleEmployeeSubmit={handleEmployeeSubmit}
                resetEmployeeForm={resetEmployeeForm}
                departments={departments}
            />

            {/* Department Creation Portal */}
            <DepartmentModal
                showDepartmentModal={showDepartmentModal}
                setShowDepartmentModal={setShowDepartmentModal}
                departmentForm={departmentForm}
                handleDepartmentInputChange={handleDepartmentInputChange}
                handleDepartmentSubmit={handleDepartmentSubmit}
                resetDepartmentForm={resetDepartmentForm}
            />

            {/* Manager Delegation Portal */}
            <ManagerModal
                showManagerModal={showManagerModal}
                setShowManagerModal={setShowManagerModal}
                selectedDepartment={selectedDepartment}
                employees={employees}
                managerForm={managerForm}
                handleManagerInputChange={handleManagerInputChange}
                handleAssignManager={handleAssignManager}
            />
        </div>
    );
};

export default AdminDashboard;
