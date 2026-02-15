import React from 'react';
import { Building2, UserCheck } from 'lucide-react';

const DepartmentStructure = ({
    departments,
    employees,
    setShowDepartmentModal,
    handleRemoveManager,
    setSelectedDepartment,
    setShowManagerModal,
    handleDeleteDepartment
}) => {
    return (
        <section className="animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-[var(--brand-primary)]" />
                    Departmental Structure
                </h2>
                <button onClick={() => setShowDepartmentModal(true)} className="px-8 py-4 bg-[var(--accent-vibrant)] text-white rounded-[1.5rem] font-black tracking-tight shadow-xl shadow-[var(--accent-vibrant)]/20 hover:scale-[1.05] transition-transform">
                    New Division
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => {
                    const deptEmployees = employees.filter(emp => emp.department?._id === dept._id);
                    return (
                        <div key={dept._id} className="glass group p-8 rounded-[3rem] border border-white/50 relative overflow-hidden active:scale-95 transition-all bg-white/40">
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 glass bg-[var(--brand-primary)] shadow-xl rounded-[1.5rem] flex items-center justify-center text-white">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-4 py-2 bg-white/60 text-[var(--brand-primary)] rounded-2xl text-[10px] font-black tracking-widest shadow-inner">
                                        {deptEmployees.length} POPULATION
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-[var(--base-text)] mb-2 leading-tight">{dept.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-8">ID // {dept.departmentID}</p>

                            <div className="space-y-6">
                                <div className="bg-white/50 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Division Manager</span>
                                        {dept.manager && (
                                            <button onClick={() => handleRemoveManager(dept.departmentID)} className="text-[10px] text-[var(--accent-danger)] font-black hover:underline tracking-tighter">DISCHARGE</button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dept.manager ? 'bg-[var(--brand-secondary)] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className={`text-sm font-black truncate ${dept.manager ? 'text-[var(--base-text)]' : 'text-gray-400'}`}>
                                                {dept.manager ? dept.manager.name : 'VACANT POSITION'}
                                            </div>
                                            {dept.manager && <div className="text-[10px] text-gray-400 font-bold">{dept.manager.employeeID}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => { setSelectedDepartment(dept); setShowManagerModal(true); }} className="px-4 py-3 bg-[var(--base-text)] text-white rounded-2xl font-black text-xs hover:bg-black transition-colors shadow-lg">
                                        {dept.manager ? 'UPDATE' : 'APPOINT'}
                                    </button>
                                    <button onClick={() => handleDeleteDepartment(dept._id)} className="px-4 py-3 bg-white/50 text-[var(--accent-danger)] rounded-2xl font-black text-[10px] hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-sm">
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DepartmentStructure;
