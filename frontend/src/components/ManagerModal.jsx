import React from 'react';
import { X } from 'lucide-react';

const ManagerModal = ({
    showManagerModal,
    setShowManagerModal,
    selectedDepartment,
    employees,
    managerForm,
    handleManagerInputChange,
    handleAssignManager
}) => {
    if (!showManagerModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assign Manager</h2>
                    <button onClick={() => setShowManagerModal(false)} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8">
                    <p className="text-xs font-medium text-slate-500 mb-8 border-l-4 border-indigo-500 pl-4 bg-indigo-50/50 py-3 rounded-r-xl">
                        Assigning manager for <span className="font-bold text-indigo-600">"{selectedDepartment?.name}"</span>. Only employees in this department are eligible.
                    </p>
                    <form onSubmit={handleAssignManager} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Select Manager</label>
                            <select
                                name="managerID"
                                value={managerForm.managerID}
                                onChange={handleManagerInputChange}
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none appearance-none"
                            >
                                <option value="">Select Employee</option>
                                {employees
                                    .filter(emp => emp.department?._id === selectedDepartment?._id)
                                    .map(emp => (
                                        <option key={emp._id} value={emp.employeeID}>{emp.name} ({emp.employeeID})</option>
                                    ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase mt-4">
                            Assign Manager
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManagerModal;
