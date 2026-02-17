import React from 'react';
import { X } from 'lucide-react';

const DepartmentModal = ({
    showDepartmentModal,
    setShowDepartmentModal,
    departmentForm,
    handleDepartmentInputChange,
    handleDepartmentSubmit,
    resetDepartmentForm
}) => {
    if (!showDepartmentModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add Department</h2>
                    <button onClick={() => { setShowDepartmentModal(false); resetDepartmentForm(); }} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleDepartmentSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Department ID</label>
                        <input
                            type="text"
                            name="departmentID"
                            placeholder="e.g. DEPT101"
                            value={departmentForm.departmentID}
                            onChange={handleDepartmentInputChange}
                            required
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Department Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Engineering"
                            value={departmentForm.name}
                            onChange={handleDepartmentInputChange}
                            required
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase mt-4">
                        Add Department
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DepartmentModal;
