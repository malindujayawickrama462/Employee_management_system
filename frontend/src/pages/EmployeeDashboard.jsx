import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
    Clock,
    Calendar,
    DollarSign,
    FileText,
    CalendarCheck,
    ArrowUpRight,
    TrendingUp,
    ChevronRight,
    Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <div className="glass group p-8 rounded-[2.5rem] hover-lift relative overflow-hidden transition-all duration-500">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-60`} />
        <div className="flex items-center justify-between mb-8">
            <div className={`p-4 bg-white shadow-inner rounded-2xl text-${color}-600 border border-white/50`}>
                <Icon className="w-7 h-7" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
        </div>
        <div className="relative">
            <h3 className="text-gray-400 font-black text-[10px] tracking-widest uppercase mb-1">{title}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tight">{description}</p>
        </div>
    </div>
);

const EmployeeDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { icon: Calendar, title: 'Leave Registry', value: '12 Days', color: 'indigo', description: 'Total available units' },
        { icon: Clock, title: 'Performance Index', value: '98.2%', color: 'emerald', description: 'Quarterly attendance' },
        { icon: Wallet, title: 'Projected Earnings', value: '$2,450', color: 'purple', description: 'Next scheduled transfer' },
        { icon: FileText, title: 'Active Requests', value: '02', color: 'rose', description: 'Pending administrative actions' },
    ];

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-72 transition-all duration-500">
                    <Header />
                    <main className="flex-1 p-10 pt-12 animate-fade-in relative">
                        {/* Welcome Section */}
                        <div className="mb-14 flex items-end justify-between">
                            <div>
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3">
                                    Operational <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Nexus</span>
                                </h1>
                                <p className="text-lg text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                    Identity: <span className="text-indigo-600">{user?.name}</span> • Primary Dashboard
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="glass px-6 py-4 rounded-3xl border border-white flex items-center gap-4 shadow-xl">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active Session Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Activity Ledger */}
                            <div className="lg:col-span-2 glass p-10 rounded-[3.5rem] border border-white/50 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                                <div className="flex items-center justify-between mb-10 relative">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                                        Activity Ledger
                                    </h2>
                                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline px-4 py-2 bg-indigo-50 rounded-xl">View Archive</button>
                                </div>

                                <div className="space-y-6 relative">
                                    {[
                                        { label: 'Leave Authorization', status: 'Approved', time: '2 hours ago', icon: 'L', color: 'emerald' },
                                        { label: 'Financial Statement', status: 'Generated', time: 'Yesterday', icon: 'F', color: 'indigo' },
                                        { label: 'System Access Update', status: 'Complete', time: 'Feb 12, 2026', icon: 'S', color: 'purple' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 glass hover:bg-white transition-all duration-300 rounded-[2rem] group cursor-default">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 bg-${item.color}-50 border-2 border-${item.color}-100 rounded-2xl flex items-center justify-center text-${item.color}-600 font-black text-xl shadow-inner`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 tracking-tight text-lg">{item.label}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.time}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border bg-${item.color}-100 text-${item.color}-700 border-${item.color}-200`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tactical Actions */}
                            <div className="space-y-8">
                                <div className="glass p-10 rounded-[3.5rem] border border-indigo-100 shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />

                                    <h2 className="text-xl font-black mb-8 tracking-tight relative">Tactical Actions</h2>
                                    <div className="space-y-4 relative">
                                        <Link to="/leaves" className="w-full py-5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl hover-lift">
                                            <CalendarCheck className="w-4 h-4" />
                                            Submit Absence Request
                                        </Link>
                                        <Link to="/salary" className="w-full py-5 border-2 border-white/20 hover:bg-white/10 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl">
                                            <DollarSign className="w-4 h-4" />
                                            Executive Payslip
                                        </Link>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/10 relative">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Upcoming Holiday</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl font-black tracking-tighter">Independence Day</p>
                                            <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black tracking-tighter">MAR 21</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass p-8 rounded-[2.5rem] border border-white/50 shadow-xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Hub</p>
                                            <p className="text-sm font-black text-gray-900">v2.4 Protocols</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-rose-500 transition-all group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default EmployeeDashboard;
