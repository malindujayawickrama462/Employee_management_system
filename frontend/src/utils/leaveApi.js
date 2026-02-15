/**
 * leaveApi.js - Interface for Attendance and Absence Services
 * 
 * Specifically handles the submission, retrieval, and institutional
 * approval flow for employee leave requests.
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/leave';

/**
 * Localized Axios Instance for Leave Services
 * 
 * Features a dedicated interceptor to ensure auth tokens are current 
 * before any leave-related transaction.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// Sync token with latest localStorage state before each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Persists a new leave application in the system.
 * @param {Object} leaveData - Includes type, dates, and reason.
 */
export const addLeave = async (leaveData) => {
    try {
        const response = await api.post('/add', leaveData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Retrieves the complete registry of leave requests.
 * Used primarily for the administrative overview.
 */
export const getLeaves = async () => {
    try {
        const response = await api.get('/get');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Fetches all leave records archived for a specific employee.
 */
export const getEmployeeLeaves = async (employeeID) => {
    try {
        const response = await api.get(`/employee/${employeeID}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Decision Logic: Updates the status (Approved/Rejected/Pending) of a request.
 */
export const updateLeaveStatus = async (id, status) => {
    try {
        const response = await api.put(`/update/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
