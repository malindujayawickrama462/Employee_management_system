import React from 'react';
import { Users, Building2, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

const CountUp = ({ value, duration = 1500 }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (typeof value === 'string') return;
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMiliseconds = duration;
        let incrementTime = (totalMiliseconds / end) * 5;

        let timer = setInterval(() => {
            start += Math.ceil(end / (duration / (incrementTime * 5)));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{typeof value === 'string' ? value : count}</span>;
};

const StatsGrid = ({ stats, formatCurrency }) => {
    const statItems = [
        {
            label: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            color: 'indigo',
            sub: 'Verification Level: Active'
        },
        {
            label: 'Departments',
            value: stats.totalDepartments,
            icon: Building2,
            color: 'emerald',
            sub: 'System Architecture'
        },
        {
            label: 'Pending Leaves',
            value: stats.pendingLeaves,
            icon: Calendar,
            color: 'rose',
            sub: 'Administrative Queue'
        },
        {
            label: 'Monthly Payroll',
            value: formatCurrency ? formatCurrency(stats.monthlyPayroll) : `$${stats.monthlyPayroll}`,
            icon: DollarSign,
            color: 'amber',
            sub: 'Fiscal Cycle'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statItems.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-xl`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                            {item.value}
                        </h3>
                        <p className="text-[10px] font-medium text-slate-500 mt-2">{item.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};




export default StatsGrid;
