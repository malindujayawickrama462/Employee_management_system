import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Leave from './Leave';
import LeaveManagement from './LeaveManagement';

const Leaves = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex min-h-screen">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <div className="flex-1 flex flex-col">
                {!isAdmin && <Header />}

                <main className={`flex-1 ml-72 transition-all duration-500`}>
                    {isAdmin ? <LeaveManagement /> : <Leave />}
                </main>
            </div>
        </div>
    );
};

export default Leaves;
