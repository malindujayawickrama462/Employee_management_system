import React from 'react';
import { Users } from 'lucide-react';

const RecentArrivals = ({ employees, setActiveTab, formatCurrency }) => {
    const recentOnboarded = employees.slice(0, 5);

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Arrivals</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">Recently onboarded personnel</p>
                </div>
                <button
                    onClick={() => setActiveTab('employees')}
                    className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                    View All
                </button>
            </div>

            <div className="divide-y divide-slate-100">
                {recentOnboarded.map((emp) => (
                    <div key={emp._id} className="p-6 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-medium text-slate-400">{emp.email}</span>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{emp.department?.name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{formatCurrency ? formatCurrency(emp.salary) : `$${emp.salary}`}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Annual Salary</p>
                        </div>
                    </div>
                ))}

                {recentOnboarded.length === 0 && (
                    <div className="p-16 text-center">
                        <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs font-medium text-slate-400">No recent inductions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentArrivals;
