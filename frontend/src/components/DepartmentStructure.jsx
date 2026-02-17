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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                    Departments
                </h2>
                <button onClick={() => setShowDepartmentModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Add Department
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => {
                    const deptEmployees = employees.filter(emp => emp.department?._id === dept._id);
                    return (
                        <div key={dept._id} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    {deptEmployees.length} Employees
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{dept.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-8">ID: {dept.departmentID}</p>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manager</span>
                                        {dept.manager && (
                                            <button onClick={() => handleRemoveManager(dept.departmentID)} className="text-[10px] text-rose-600 font-bold hover:underline uppercase tracking-wider">Remove</button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dept.manager ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className={`text-sm font-bold truncate ${dept.manager ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {dept.manager ? dept.manager.name : 'Vacant'}
                                            </div>
                                            {dept.manager && <div className="text-[10px] text-slate-400 font-bold">{dept.manager.employeeID}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => { setSelectedDepartment(dept); setShowManagerModal(true); }} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-colors">
                                        {dept.manager ? 'Update' : 'Appoint'}
                                    </button>
                                    <button onClick={() => handleDeleteDepartment(dept._id)} className="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all">
                                        Delete
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
