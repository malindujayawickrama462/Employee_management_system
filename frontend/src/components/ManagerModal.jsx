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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <div className="glass bg-white/95 rounded-[3rem] max-w-md w-full p-10 animate-scale-in">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">Appointing <br />Command</h2>
                    <button onClick={() => setShowManagerModal(false)} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm font-bold text-gray-500 mb-8 border-l-4 border-[var(--brand-primary)] pl-4 bg-[var(--brand-primary)]/10 py-3 rounded-r-xl">
                    Assigning manager for <span className="text-[var(--brand-primary)]">"{selectedDepartment?.name}"</span>. Only employees currently within this division are eligible.
                </p>
                <form onSubmit={handleAssignManager} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Target Personnel ID</label>
                        <select
                            name="managerID"
                            value={managerForm.managerID}
                            onChange={handleManagerInputChange}
                            required
                            className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner appearance-none"
                        >
                            <option value="">SELECT ELIGIBLE PERSONNEL</option>
                            {employees
                                .filter(emp => emp.department?._id === selectedDepartment?._id)
                                .map(emp => (
                                    <option key={emp._id} value={emp.employeeID}>{emp.name} ({emp.employeeID})</option>
                                ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full py-5 bg-[var(--brand-primary)] text-white rounded-[1.5rem] font-black tracking-widest shadow-xl hover:bg-[var(--brand-primary)]/90 transition-all">
                        APPOINT MANAGER
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManagerModal;
