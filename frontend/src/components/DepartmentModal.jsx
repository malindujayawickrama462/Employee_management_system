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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <div className="glass bg-white/95 rounded-[3rem] max-w-md w-full p-10 animate-scale-in">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">Establishing <br />Unit</h2>
                    <button onClick={() => { setShowDepartmentModal(false); resetDepartmentForm(); }} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Division ID</label>
                        <input
                            type="text"
                            name="departmentID"
                            value={departmentForm.departmentID}
                            onChange={handleDepartmentInputChange}
                            required
                            className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Unit Name</label>
                        <input
                            type="text"
                            name="name"
                            value={departmentForm.name}
                            onChange={handleDepartmentInputChange}
                            required
                            className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner"
                        />
                    </div>
                    <button type="submit" className="w-full py-5 bg-[var(--brand-primary)] text-white rounded-[1.5rem] font-black tracking-widest shadow-xl hover:bg-[var(--brand-primary)]/90 transition-all">
                        CONFIRM UNIT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DepartmentModal;
