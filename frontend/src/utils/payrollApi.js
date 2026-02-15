/**
 * payrollApi.js - Interface for Financial and Payroll Services
 * 
 * Manages the generation, retrieval, and distribution of employee salary
 * records. Includes specialized logic for handling PDF document streams.
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payroll';

/**
 * Generates a financial record for a single employee for a specific period.
 */
export const generatePayroll = async (payrollData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/add`, payrollData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Massive Operation: Triggers payroll calculation for the entire workforce
 * for a specific month and year.
 */
export const generateBulkPayroll = async (month, year) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/bulk`, { month, year }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Retrieves the master financial ledger.
 * Access restricted to Admin/Executive roles.
 */
export const getAllPayrolls = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Fetches the chronological payroll history for a specific individual.
 */
export const getEmployeePayrolls = async (employeeID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/get`, {
            params: { employeeID },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Retrieves a detailed breakdown for a single pay cycle.
 */
export const getSingleSalarySlip = async (employeeID, year, month) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/singleGet`, {
            params: { employeeID, year, month },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Document Streaming Interface: Handles PDF generation/download.
 * 
 * This function handles the binary response from the server, converts it 
 * to a browser-compatible Blob, and triggers a virtual click to 
 * initiate the user's local download manager.
 */
export const downloadPayslip = async (payrollID, employeeName, month, year) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/payslip/${payrollID}`, {
            responseType: 'blob', // Critical: Forces axios to handle response as binary
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Binary to Blob translation
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Dynamic Anchor Injection for triggering system download
        const link = document.createElement('a');
        link.href = url;
        link.download = `Payslip_${employeeName}_${month}_${year}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Garbage collection
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Removes a payroll record from the ledger.
 */
export const deletePayroll = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
