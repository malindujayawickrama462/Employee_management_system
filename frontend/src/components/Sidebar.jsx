import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    CalendarCheck,
    Banknote,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/employee-dashboard' },
        { icon: User, label: 'My Profile', path: '/profile' },
        { icon: CalendarCheck, label: 'Leaves', path: '/leaves' },
        { icon: Banknote, label: 'Salary', path: '/salary' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex flex-col w-64 h-[calc(100vh-2rem)] m-4 glass-dark rounded-3xl text-white shadow-2xl fixed left-0 top-0 z-50 overflow-hidden border border-white/10">
            <div className="flex items-center justify-center h-24 border-b border-white/5">
                <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    EMP<span className="text-white">MANAGE</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-5 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                                ? 'bg-indigo-600/40 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-4 transition-transform duration-500 group-hover:scale-110" />
                        <span className="font-semibold tracking-wide text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/20">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-5 py-3 text-gray-400 font-bold transition-all duration-300 rounded-2xl hover:bg-red-500/10 hover:text-red-400 group"
                >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover:-translate-x-1" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
