import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, UserCircle } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between h-20 px-8 bg-white shadow-sm ml-64">
            <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100 hover:text-indigo-600">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
