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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Employee Management System</p>
                    </div>
                    <button onClick={() => { setShowEmployeeModal(false); resetEmployeeForm(); }} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleEmployeeSubmit} className="p-10 overflow-y-auto max-h-[calc(90vh-120px)] sm:grid sm:grid-cols-2 sm:gap-6">
                    {[
                        { name: 'employeeID', label: 'Employee ID', type: 'text', disabled: !!editingEmployee, placeholder: 'e.g. EMP100' },
                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter name' },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@company.com' },
                        ...(!editingEmployee ? [{ name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }] : []),
                        { name: 'nic', label: 'NIC/Gov ID', type: 'text', placeholder: 'Enter ID number' },
                        { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g. Developer' },
                        { name: 'salary', label: 'Salary', type: 'number', placeholder: '0.00' },
                        { name: 'dob', label: 'Date of Birth', type: 'date' },
                        { name: 'contractExpiry', label: 'Contract Expiry', type: 'date' }
                    ].map((field) => (
                        <div key={field.name} className="mb-6 sm:mb-0">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={employeeForm[field.name]}
                                onChange={handleEmployeeInputChange}
                                required={['employeeID', 'name', 'email', 'password', 'nic'].includes(field.name)}
                                disabled={field.disabled}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 placeholder-slate-300 shadow-sm outline-none disabled:bg-slate-50/50 disabled:cursor-not-allowed"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                    <div className="mb-6 sm:mb-0">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Department</label>
                        <select
                            name="department"
                            value={employeeForm.department}
                            onChange={handleEmployeeInputChange}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all font-bold text-slate-700 shadow-sm outline-none appearance-none"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2 pt-6">
                        <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm uppercase">
                            {editingEmployee ? 'Save Changes' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
