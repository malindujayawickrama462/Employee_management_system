/**
 * employeeApi.js - Interface for Personnel Management Services
 * 
 * Provides abstraction for all CRUD operations related to employees.
 * Note: While these functions currently manage headers manually, 
 * centralizing via the 'api.js' utility is recommended for future refactors.
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employee';

/**
 * Retrieves a comprehensive list of all personnel in the system.
 * Requires Admin/HR privileges.
 */
export const getAllEmployees = async () => {
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
 * Fetches a specific employee record using their unique system ID.
 */
export const getEmployeeById = async (employeeID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${employeeID}`, {
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
 * Registers a new employee profile in the database.
 */
export const addEmployee = async (employeeData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, employeeData, {
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
 * Modifies existing employee records (Salary, Position, Department, etc.).
 */
export const updateEmployee = async (employeeID, employeeData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${employeeID}`, employeeData, {
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
 * Permanently removes an employee profile from the registry.
 */
export const deleteEmployee = async (employeeID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${employeeID}`, {
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
 * Securely retrieves the currently authenticated user's own profile.
 * Used for the "My Profile" view.
 */
export const getMe = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/me`, {
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
 * Allows the current user to update their own contact information.
 */
export const updateMe = async (employeeData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/update-me`, employeeData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
