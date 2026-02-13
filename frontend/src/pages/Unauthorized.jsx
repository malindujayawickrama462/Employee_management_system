import React from 'react';

const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">403: Unauthorized</h1>
                <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
            </div>
        </div>
    );
};

export default Unauthorized;
