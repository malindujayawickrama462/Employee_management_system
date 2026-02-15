import React from 'react';
import { Users, Building2, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

const StatsGrid = ({ stats, formatCurrency }) => {
    const statItems = [
        { label: 'Total Workforce', value: stats.totalEmployees, icon: Users, color: 'var(--brand-primary)' },
        { label: 'Active Depts', value: stats.totalDepartments, icon: Building2, color: 'var(--brand-secondary)' },
        { label: 'Pending Requests', value: stats.pendingLeaves, icon: Calendar, color: 'var(--accent-vibrant)' },
        { label: 'Monthly Volume', value: formatCurrency(stats.monthlyPayroll), icon: DollarSign, color: 'var(--accent-success)' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statItems.map((item, idx) => (
                <div key={idx} className="glass group p-8 rounded-[2.5rem] hover-lift relative overflow-hidden bg-white/40">
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16`} style={{ backgroundColor: item.color }} />
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 bg-white shadow-inner rounded-2xl`} style={{ color: item.color }}>
                            <item.icon className="w-8 h-8" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-[var(--accent-vibrant)] transition-colors" />
                    </div>
                    <h3 className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">{item.label}</h3>
                    <p className="text-3xl font-black text-[var(--base-text)]">{item.value}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
