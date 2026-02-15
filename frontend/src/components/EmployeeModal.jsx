import React from 'react';
import { X } from 'lucide-react';

const EmployeeModal = ({
    showEmployeeModal,
    setShowEmployeeModal,
    editingEmployee,
    employeeForm,
    handleEmployeeInputChange,
    handleEmployeeSubmit,
    resetEmployeeForm,
    departments
}) => {
    if (!showEmployeeModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <div className="glass bg-white/95 rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white animate-scale-in">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-[var(--base-foundation)]">
                    <div>
                        <h2 className="text-3xl font-black text-[var(--base-text)] tracking-tighter">
                            {editingEmployee ? 'Update Profile' : 'New Personnel'}
                        </h2>
                        <p className="text-sm font-bold text-gray-500">Employee Management System • Registry</p>
                    </div>
                    <button onClick={() => { setShowEmployeeModal(false); resetEmployeeForm(); }} className="p-3 bg-white shadow-md rounded-2xl text-gray-400 hover:text-[var(--accent-danger)] hover:rotate-90 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleEmployeeSubmit} className="p-10 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { name: 'employeeID', label: 'Reference ID', type: 'text', disabled: !!editingEmployee, placeholder: 'EMP-XX' },
                            { name: 'name', label: 'Full Identity', type: 'text', placeholder: 'Hideo Kojima' },
                            { name: 'email', label: 'Communication Hub (Email)', type: 'email', placeholder: 'hideo@kojimaproductions.com' },
                            ...(!editingEmployee ? [{ name: 'password', label: 'Secure Key (Password)', type: 'password', placeholder: '••••••••' }] : []),
                            { name: 'nic', label: 'Gov ID / NIC', type: 'text', placeholder: '87342312V' },
                            { name: 'position', label: 'Operation Role', type: 'text', placeholder: 'Director' },
                            { name: 'salary', label: 'Base Compensation', type: 'number', placeholder: '99999' }
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={employeeForm[field.name]}
                                    onChange={handleEmployeeInputChange}
                                    required={['employeeID', 'name', 'email', 'password', 'nic'].includes(field.name)}
                                    disabled={field.disabled}
                                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 placeholder-gray-300 shadow-inner"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Structural Unit</label>
                            <select
                                name="department"
                                value={employeeForm.department}
                                onChange={handleEmployeeInputChange}
                                className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--brand-primary)] focus:bg-white rounded-[1.5rem] transition-all font-black text-gray-700 shadow-inner appearance-none"
                            >
                                <option value="">Select Division</option>
                                {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-12 py-5 bg-[var(--base-text)] text-white rounded-[1.5rem] font-black tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-[0.98]">
                        {editingEmployee ? 'COMMIT CHANGES' : 'AUTHORIZE REGISTRY'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
