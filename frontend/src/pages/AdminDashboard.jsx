import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, AlertCircle } from 'lucide-react';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../utils/employeeApi';
import { getAllDepartments, addDepartment, deleteDepartment, assignManager, removeManager } from '../utils/departmentApi';
import { getAllPayrolls } from '../utils/payrollApi';
import AdminSidebar from '../components/AdminSidebar';

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
                <DashboardHeader
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    loading={loading}
                    fetchAllData={fetchAllData}
                />

                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-[var(--accent-success)] text-green-800' : 'border-[var(--accent-danger)] text-red-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <UserCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        <StatsGrid stats={stats} formatCurrency={formatCurrency} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                <RecentArrivals
                                    employees={employees}
                                    setActiveTab={setActiveTab}
                                    formatCurrency={formatCurrency}
                                />
                            </div>
                            <div className="space-y-8">
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

            <DepartmentModal
                showDepartmentModal={showDepartmentModal}
                setShowDepartmentModal={setShowDepartmentModal}
                departmentForm={departmentForm}
                handleDepartmentInputChange={handleDepartmentInputChange}
                handleDepartmentSubmit={handleDepartmentSubmit}
                resetDepartmentForm={resetDepartmentForm}
            />

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
