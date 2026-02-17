import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Activity, Bell, Calendar, DollarSign, UserCheck, Clock } from 'lucide-react';

const ActivityPulse = () => {
    const { notifications } = useNotification();

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Activity</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">Real-time system events</p>
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {notifications.slice(0, 8).map((n) => (
                    <div key={n._id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-slate-300 before:rounded-full group">
                        <div className="flex items-start justify-between">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                                {n.title}
                            </h4>
                            <span className="text-[10px] font-medium text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                        </p>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="py-12 text-center">
                        <Activity className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs font-medium text-slate-400">No recent activity</p>
                    </div>
                )}
            </div>
            {/* Health footer removed for simplification */}
        </div>
    );
};


export default ActivityPulse;
