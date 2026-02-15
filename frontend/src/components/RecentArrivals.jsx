import React from 'react';

const RecentArrivals = ({ employees, setActiveTab, formatCurrency }) => {
    return (
        <section className="glass p-10 rounded-[3rem] bg-white/40">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[var(--base-text)] tracking-tight">Recent Arrivals</h2>
                <button onClick={() => setActiveTab('employees')} className="text-[var(--brand-primary)] font-bold text-sm hover:underline">View All Registry</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-widest border-b border-white/20">
                            <th className="pb-4 px-2">Identities</th>
                            <th className="pb-4 px-2">Positions</th>
                            <th className="pb-4 px-2 text-right">Compensation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {employees.slice(0, 4).map((emp) => (
                            <tr key={emp._id} className="group hover:bg-white/30 transition-colors">
                                <td className="py-5 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[var(--brand-primary)] shadow-inner">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-[var(--base-text)]">{emp.name}</div>
                                            <div className="text-xs text-gray-400 font-bold">{emp.employeeID}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-2">
                                    <div className="font-bold text-gray-600">{emp.position}</div>
                                    <div className="text-xs text-[var(--accent-vibrant)] font-black uppercase tracking-tighter">{emp.department?.name || 'N/A'}</div>
                                </td>
                                <td className="py-5 px-2 text-right font-black text-[var(--base-text)]">
                                    {formatCurrency(emp.salary || 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default RecentArrivals;
