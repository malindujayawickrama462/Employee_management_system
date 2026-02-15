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
        { icon: LayoutDashboard, label: 'Operational Hub', path: '/employee-dashboard' },
        { icon: User, label: 'Identity Card', path: '/profile' },
        { icon: CalendarCheck, label: 'Leave Registry', path: '/leaves' },
        { icon: Banknote, label: 'Capital Assets', path: '/salary' },
        { icon: Settings, label: 'System Config', path: '/settings' },
    ];

    return (
        <div className="flex flex-col w-72 h-[calc(100vh-2rem)] m-4 glass rounded-[3rem] text-gray-900 shadow-2xl fixed left-0 top-0 z-50 overflow-hidden border border-white/50 backdrop-blur-3xl transition-all duration-500">
            <div className="flex flex-col items-center justify-center h-32 border-b border-indigo-50/50 bg-white/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500" />
                <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                    EMP<span className="text-neutral-900">MEMBER</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <Lock className="w-3 h-3 text-indigo-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Personnel Access Level</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-10 space-y-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.05] z-10'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-white hover:shadow-lg'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-4 transition-transform duration-500 group-hover:rotate-6" />
                        <span className="font-black tracking-widest text-[10px] uppercase">{item.label}</span>

                        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white opacity-0 group-[.active]:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-indigo-50 bg-white/40">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-6 py-4 text-gray-400 font-black text-[10px] tracking-widest uppercase transition-all duration-300 rounded-2xl hover:bg-rose-50 hover:text-rose-600 group active:scale-95 shadow-inner border border-transparent hover:border-rose-100"
                >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover:-translate-x-1" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
