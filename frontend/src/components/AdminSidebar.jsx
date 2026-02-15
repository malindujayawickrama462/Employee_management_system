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
        <div className="flex flex-col w-64 h-[calc(100vh-2rem)] m-4 glass rounded-[2.5rem] text-[var(--base-text)] shadow-2xl fixed left-0 top-0 z-50 overflow-hidden border border-white/40">
            <div className="flex items-center justify-center h-24 border-b border-indigo-100/30 bg-white/40">
                <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">
                    EMP<span className="text-[var(--base-text)]">MANAGE</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-5 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                                ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20 scale-[1.02]'
                                : 'text-gray-500 hover:text-[var(--brand-primary)] hover:bg-white/50 hover:scale-[1.02]'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-4 transition-transform duration-500 group-hover:scale-110" />
                        <span className="font-black tracking-tight text-sm uppercase text-[10px] tracking-[0.1em]">{item.label}</span>

                        {/* Interactive selection indicator - 10% Accent Role */}
                        <span className="absolute left-0 top-0 h-full w-1.5 bg-[var(--accent-vibrant)] transform -translate-x-full transition-transform duration-300 opacity-0 group-[.active]:translate-x-0 group-[.active]:opacity-100" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-indigo-100/30 bg-white/20">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-5 py-4 text-gray-500 font-black text-[10px] tracking-widest uppercase transition-all duration-300 rounded-2xl hover:bg-[var(--accent-danger)]/10 hover:text-[var(--accent-danger)] group active:scale-95 shadow-inner"
                >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover:-translate-x-1" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
