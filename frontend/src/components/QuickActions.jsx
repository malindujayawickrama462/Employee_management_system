import React from 'react';
import { UserPlus, Building2, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ resetEmployeeForm, setShowEmployeeModal, setShowDepartmentModal }) => {
    const navigate = useNavigate();

    return (
        <section className="glass p-10 rounded-[3rem] bg-[var(--brand-primary)] text-white relative shadow-[0_20px_50px_rgba(79,70,229,0.35)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <Plus className="w-12 h-12 mb-6 opacity-30" />
            <h2 className="text-3xl font-black mb-4 leading-tight">Master <br />Controllers</h2>
            <div className="space-y-4">
                <button
                    onClick={() => { resetEmployeeForm(); setShowEmployeeModal(true); }}
                    className="w-full py-4 bg-white text-[var(--brand-primary)] font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3 shadow-xl"
                >
                    <UserPlus className="w-5 h-5" />
                    Recruit Employee
                </button>
                <button
                    onClick={() => setShowDepartmentModal(true)}
                    className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3"
                >
                    <Building2 className="w-5 h-5" />
                    Establish Dept
                </button>
                <button
                    onClick={() => navigate('/payroll')}
                    className="w-full py-4 bg-[var(--accent-vibrant)] text-white font-black rounded-2xl hover:scale-[1.03] transition-transform flex items-center justify-center gap-3 shadow-lg shadow-[var(--accent-vibrant)]/30"
                >
                    <DollarSign className="w-5 h-5" />
                    Process Payroll
                </button>
            </div>
        </section>
    );
};

export default QuickActions;
