/**
 * departmentApi.js - Interface for Organizational Structure Services
 * 
 * Manages all backend interactions related to departments, including
 * hierarchy management, manager delegation, and personnel allocation.
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dep';

/**
 * Retrieves the full list of all registered departments.
 */
export const getAllDepartments = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/get`, {
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
 * Creates a new organizational unit (Department).
 */
export const addDepartment = async (departmentData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/add`, departmentData, {
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
 * Modifies specific department details.
 */
export const updateDepartment = async (id, departmentData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/update/${id}`, departmentData, {
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
 * Deletes a department. 
 * WARNING: Ensure all employees are transferred or removed before deletion.
 */
export const deleteDepartment = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
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
 * Delegation Logic: Assigns an employee as the official manager of a department.
 */
export const assignManager = async (departmentID, managerID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/assign-m`,
            { departmentID, managerID },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Revokes manager status from a department.
 */
export const removeManager = async (departmentID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/delete-m`,
            { departmentID },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Allocation Logic: Adds a specific employee to a department's roster.
 */
export const addEmployeeToDepartment = async (departmentID, employeeID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/add-e`,
            { departmentID, employeeID },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Mobility Logic: Seamlessly moves an employee from one department to another.
 */
export const transferEmployee = async (employeeID, newDepartmentID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/transfer`,
            { employeeID, newDepartmentID },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Filtering Logic: Retrieves all employees currently assigned to a specific department.
 */
export const getEmployeesByDepartment = async (departmentID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/get-e`,
            {
                params: { departmentID },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
