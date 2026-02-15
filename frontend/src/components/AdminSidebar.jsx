import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    DollarSign,
    CalendarCheck,
    Settings,
    LogOut
} from 'lucide-react';

const AdminSidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
        { icon: Users, label: 'Employees', path: '/admin-dashboard' },
        { icon: Building2, label: 'Departments', path: '/admin-dashboard' },
        { icon: DollarSign, label: 'Payroll', path: '/payroll' },
        { icon: CalendarCheck, label: 'Leaves', path: '/leaves' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-indigo-800 to-indigo-600 text-white shadow-xl fixed left-0 top-0">
            <div className="flex items-center justify-center h-20 shadow-md">
                <h1 className="text-2xl font-bold tracking-wider">EmpManage</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                ? 'bg-indigo-500 shadow-lg translate-x-1'
                                : 'hover:bg-indigo-700 hover:translate-x-1'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-indigo-500">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-indigo-100 transition-colors rounded-lg hover:bg-indigo-700 hover:text-white"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
