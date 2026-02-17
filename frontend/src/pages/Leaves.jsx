/**
 * Leaves.jsx - Dynamic Leave Entry Point
 * 
 * This component acts as a high-level router/wrapper for leave-related features.
 * It uses role-based logic to determine whether to render the:
 * 1. Admin/HR View (LeaveManagement.jsx) for approving/tracking all requests.
 * 2. Employee View (Leave.jsx) for submitting personal requests.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Leave from './Leave'; // Employee-facing leave form and history
import LeaveManagement from './LeaveManagement'; // Admin-facing approval dashboard

const Leaves = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Note: We don't add ml-72 here because the child components (Leave/LeaveManagement) 
    // already handle their own layout and sidebar spacing.
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* View delegation based on user role */}
            {isAdmin ? (
                <div className="flex-1">
                    <LeaveManagement />
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <Leave />
                </div>
            )}
        </div>
    );
};

export default Leaves;
