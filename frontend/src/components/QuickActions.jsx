import React from 'react';
import { UserPlus, Building2, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ resetEmployeeForm, setShowEmployeeModal, setShowDepartmentModal }) => {
    const navigate = useNavigate();

    const actions = [
        { label: 'Add Employee', icon: UserPlus, onClick: () => { resetEmployeeForm(); setShowEmployeeModal(true); }, primary: true },
        { label: 'Add Department', icon: Building2, onClick: () => setShowDepartmentModal(true) },
        { label: 'Payroll', icon: DollarSign, onClick: () => navigate('/payroll') }
    ];

    return (
        <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            </div>

            <div className="space-y-3">
                {actions.map((action, i) => (
                    <button
                        key={i}
                        onClick={action.onClick}
                        className={`w-full py-3.5 rounded-xl flex items-center justify-between px-6 transition-all duration-200 ${action.primary
                            ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                            : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <action.icon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">{action.label}</span>
                        </div>
                        <Plus className="w-4 h-4 opacity-50 transition-opacity" />
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;
