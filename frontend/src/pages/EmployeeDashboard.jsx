/**
 * EmployeeDashboard.jsx - Personalized Hub for Team Members
 * 
 * This component provides employees with a high-level overview of their 
 * standing within the organization, including leave balances, performance 
 * metrics, and quick access to critical actions like leave requests.
 */

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

/**
 * StatCard - Reusable visual indicator for a single metric
 */
const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-6">
            <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl`}>
                <Icon className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>

        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-[10px] font-medium text-slate-500 mt-2">{description}</p>
        </div>
    </div>
);


const EmployeeDashboard = () => {
    const { user } = useAuth();

    // -- Dashboard Metrics --
    const stats = [
        { icon: Calendar, title: 'Leave Balance', value: '12 Days', color: 'indigo', description: 'Available annual leave' },
        { icon: Clock, title: 'Performance Score', value: '98.2%', color: 'emerald', description: 'Recent performance rating' },
        { icon: Wallet, title: 'Estimated Salary', value: '$2,450', color: 'purple', description: 'Next payout estimation' },
        { icon: FileText, title: 'Leave Requests', value: '02', color: 'rose', description: 'Leaves pending approval' },
    ];

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-72 min-h-screen">
                    <Header />

                    <main className="flex-1 p-8 animate-fade-in">

                        {/* Welcome Section */}
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                                    Dashboard
                                </h1>
                                <p className="text-sm font-medium text-slate-500">
                                    Welcome back, <span className="text-indigo-600 font-bold">{user?.name}</span>
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">System Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Recent Activity */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                        Recent Activity
                                    </h2>
                                    <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline px-3 py-1.5 bg-indigo-50 rounded-lg">View All</button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Leave Request', status: 'Approved', time: '2 hours ago', icon: 'L', color: 'emerald' },
                                        { label: 'Payroll Generated', status: 'Complete', time: 'Yesterday', icon: 'P', color: 'indigo' },
                                        { label: 'Profile Update', status: 'Success', time: 'Feb 12, 2026', icon: 'U', color: 'purple' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all rounded-2xl group cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color}-600 font-bold text-lg`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 tracking-tight">{item.label}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.time}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-100`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-6">
                                <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                                    <h2 className="text-lg font-bold mb-6 tracking-tight">Quick Actions</h2>
                                    <div className="space-y-3">
                                        <Link to="/leaves" className="w-full py-4 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-md">
                                            <CalendarCheck className="w-4 h-4" />
                                            Request Leave
                                        </Link>
                                        <Link to="/salary" className="w-full py-4 border-2 border-white/20 hover:bg-white/10 rounded-xl transition-all font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            View Payslip
                                        </Link>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Next Holiday</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold tracking-tight">Independence Day</p>
                                            <div className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-bold tracking-tight">MAR 21</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resources */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy</p>
                                            <p className="text-xs font-bold text-slate-900">Employee Handbook</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-all group-hover:translate-x-1" />
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
