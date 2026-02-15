import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, UserCircle, Shield, Globe, Zap } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between h-24 px-10 glass border-b border-white/50 backdrop-blur-2xl sticky top-0 z-40 transition-all duration-500">
            <div className="flex items-center w-full max-w-xl">
                <div className="relative w-full group">
                    <span className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search system protocols..."
                        className="w-full py-4 pl-16 pr-6 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-700 transition-all duration-500 shadow-inner group-hover:bg-gray-100/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[8px] font-black text-gray-400 shadow-sm">CTRL</span>
                        <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[8px] font-black text-gray-400 shadow-sm">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-8">
                <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Encrypted</span>
                    </div>
                    <div className="w-px h-4 bg-indigo-200" />
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Global Node</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-3 text-gray-400 transition-all rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-lg group">
                        <Bell className="w-6 h-6 transition-transform group-hover:rotate-12" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    <div className="h-10 w-px bg-gray-100 mx-2" />

                    <div className="flex items-center space-x-4 cursor-pointer group p-1 pr-4 rounded-2xl hover:bg-white/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <UserCircle className="w-7 h-7 relative z-10" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{user?.name}</p>
                            <div className="flex items-center gap-1.5 ">
                                <Zap className="w-3 h-3 text-indigo-500" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{user?.role} Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
