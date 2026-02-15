import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employee';

// Get all employees
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

// Get employee by ID
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

// Add new employee
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

// Update employee
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

// Delete employee
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

// Get current logged in employee's profile
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

// Update current logged in employee's profile
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
