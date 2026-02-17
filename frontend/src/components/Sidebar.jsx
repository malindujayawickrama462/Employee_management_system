import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    CalendarCheck,
    Banknote,
    Settings,
    LogOut,
    Lock
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/employee-dashboard' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: CalendarCheck, label: 'Leaves', path: '/leaves' },
        { icon: Banknote, label: 'Salary', path: '/salary' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex flex-col w-72 fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 shadow-sm z-50 overflow-hidden transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-32 border-b border-slate-50 bg-slate-50/50 relative overflow-hidden">
                <h1 className="text-2xl font-black tracking-tighter text-slate-900">
                    EMP<span className="text-indigo-600">MS</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Employee Portal</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 mr-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="text-sm">{item.label}</span>
                            </>
                        )}
                    </NavLink>

                ))}
            </nav>

            <div className="p-6 border-t border-slate-50 bg-slate-50/20">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-6 py-4 text-slate-500 font-medium text-sm transition-all duration-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 group active:scale-95"
                >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover:-translate-x-1" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};


export default Sidebar;
