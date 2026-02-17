import React from 'react';
import { RefreshCw } from 'lucide-react';

const DashboardHeader = ({ activeTab, setActiveTab, loading, fetchAllData }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Overview
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                    System Management • {new Date().toDateString()}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
                    {['overview', 'employees', 'departments'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === tab
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button
                    onClick={fetchAllData}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
                </button>
            </div>
        </div>
    );
};



export default DashboardHeader;
