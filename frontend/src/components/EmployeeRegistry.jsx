import { Users, Search, Edit, Trash2, Building2, BarChart2 } from 'lucide-react';

const EmployeeRegistry = ({
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    openEditEmployee,
    handleDeleteEmployee,
    formatCurrency,
    setReportEmployeeID
}) => {

    return (
        <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Employees
                </h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700"
                    />
                </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Position</th>
                            <th className="px-6 py-4 text-right">Salary</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp._id} className="group hover:bg-slate-50/80 transition-all duration-200">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{emp.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{emp.employeeID}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                                        {emp.position}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                                        <Building2 className="w-3 h-3" />
                                        {emp.department?.name || 'Unassigned'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="font-bold text-slate-900">{formatCurrency ? formatCurrency(emp.salary || 0) : `$${emp.salary || 0}`}</div>
                                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Base Salary</div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEditEmployee(emp)} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setReportEmployeeID(emp.employeeID)} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm" title="Report">
                                            <BarChart2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteEmployee(emp.employeeID)} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm" title="Delete">
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
