import React from 'react';
import { ChevronRight, Shield, User, Building2 } from 'lucide-react';

const OrgStructureTree = ({ departments, employees }) => {
    return (
        <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Chart</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">Hierarchical distribution of departments</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {departments.map((dept) => {
                    const manager = employees.find(e => e.employeeID === (dept.manager?.employeeID || dept.manager));
                    const deptEmployees = employees.filter(e => e.department?._id === dept._id || e.department === dept._id);

                    return (
                        <div key={dept._id} className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-lg">{dept.departmentID}</span>
                                    <h3 className="text-lg font-bold text-slate-900 mt-2">{dept.name}</h3>
                                </div>
                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                                    {deptEmployees.length}
                                </div>
                            </div>

                            {/* Manager Card */}
                            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[8px] font-bold uppercase tracking-wider opacity-70">Department Head</p>
                                        <p className="text-xs font-bold truncate">{manager?.name || 'Vacant'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subordinate Pulse */}
                            <div className="mt-6 space-y-2">
                                {deptEmployees.slice(0, 3).map((emp) => (
                                    <div key={emp._id} className="flex items-center justify-between p-2.5 hover:bg-white rounded-xl transition-all group/row border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{emp.name}</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover/row:text-indigo-400 transition-all" />
                                    </div>
                                ))}
                                {deptEmployees.length > 3 && (
                                    <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-tight mt-3">+{deptEmployees.length - 3} More Employees</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};


export default OrgStructureTree;
