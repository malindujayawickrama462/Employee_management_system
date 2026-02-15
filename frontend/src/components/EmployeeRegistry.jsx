import React from 'react';
import { Users, Search, Edit, Trash2, Building2 } from 'lucide-react';

const EmployeeRegistry = ({
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    openEditEmployee,
    handleDeleteEmployee,
    formatCurrency
}) => {
    return (
        <section className="glass p-10 rounded-[3rem] animate-fade-in overflow-hidden bg-white/40">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter flex items-center gap-3">
                    <Users className="w-8 h-8 text-[var(--brand-primary)]" />
                    Workforce Registry
                </h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by identity, position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white/50 border-none rounded-2xl focus:ring-4 focus:ring-[var(--brand-secondary)]/10 transition-all font-bold text-gray-700 shadow-inner"
                    />
                </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-left text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                            <th className="px-6">Identity Card</th>
                            <th className="px-6">Status Details</th>
                            <th className="px-6 text-right">Compensation</th>
                            <th className="px-6 text-center">Controls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp._id} className="glass group hover:bg-white transition-all duration-300">
                                <td className="px-6 py-6 rounded-l-[1.5rem]">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white border-2 border-[var(--base-foundation)] rounded-2xl flex items-center justify-center text-[var(--brand-primary)] font-black text-xl shadow-inner">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-[var(--base-text)] text-lg">{emp.name}</div>
                                            <div className="text-sm text-gray-500 font-bold">{emp.email} • {emp.employeeID}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-vibrant)]/10 text-[var(--accent-vibrant)] rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                                        <div className="w-1.5 h-1.5 bg-[var(--accent-vibrant)] rounded-full animate-pulse" />
                                        {emp.position}
                                    </div>
                                    <div className="text-xs text-[var(--brand-primary)]/80 font-black flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {emp.department?.name || 'GENERIC'}
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="text-xl font-black text-[var(--base-text)]">{formatCurrency(emp.salary || 0)}</div>
                                    <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Base Monthly</div>
                                </td>
                                <td className="px-6 py-6 rounded-r-[1.5rem] text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => openEditEmployee(emp)} className="p-3 bg-white text-[var(--brand-primary)] rounded-xl hover:bg-[var(--brand-primary)] hover:text-white transition-all shadow-sm">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteEmployee(emp.employeeID)} className="p-3 bg-white text-[var(--accent-danger)] rounded-xl hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-sm">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default EmployeeRegistry;
