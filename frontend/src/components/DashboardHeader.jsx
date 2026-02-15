import React from 'react';
import { RefreshCw } from 'lucide-react';

const DashboardHeader = ({ activeTab, setActiveTab, loading, fetchAllData }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-[var(--base-text)] mb-3">
                    System <span className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">Overview</span>
                </h1>
                <p className="text-lg text-gray-500 font-medium">
                    Premium Management Suite • <span className="text-[var(--brand-primary)]">{new Date().toDateString()}</span>
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="glass p-1.5 rounded-2xl flex gap-1 border border-white/50">
                    {['overview', 'employees', 'departments'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab
                                ? 'bg-[var(--brand-primary)] text-white shadow-lg'
                                : 'text-gray-500 hover:bg-white/50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={fetchAllData}
                    className="p-3 glass rounded-2xl hover:bg-white transition-all shadow-sm hover:shadow-md text-[var(--brand-primary)]"
                    title="Sync Data"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
