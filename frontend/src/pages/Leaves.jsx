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

    return (
        <div className="flex min-h-screen">
            {/* Sidebar selection based on administrative status */}
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className="flex-1 flex flex-col">
                {/* Global header is only shown for non-admin views for consistency */}
                {!isAdmin && <Header />}

                <main className={`flex-1 ml-72 transition-all duration-500`}>
                    {/* View delegation based on user role */}
                    {isAdmin ? <LeaveManagement /> : <Leave />}
                </main>
            </div>
        </div>
    );
};

export default Leaves;
