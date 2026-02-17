import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, Building2, Calendar,
    Settings, LogOut, Shield, ChevronRight, Zap
} from 'lucide-react';


const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { id: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: '/employees', icon: Users, label: 'Employees' },
        { id: '/departments', icon: Building2, label: 'Departments' },
        { id: '/leaves', icon: Calendar, label: 'Leaves' },
        { id: '/payroll', icon: Building2, label: 'Payroll' },
        { id: '/performance', icon: Zap, label: 'Performance' },
        { id: '/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-[50]">
            {/* Branding */}
            <div className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tighter">EMP<span className="text-indigo-600">MS</span></h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Portal</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="text-sm">{item.label}</span>
                            {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
                >
                    <LogOut className="w-5 h-5 opacity-60" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};


export default AdminSidebar;
