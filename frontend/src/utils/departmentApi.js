import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dep';

// Get all departments
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

// Add new department
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

// Update department
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

// Delete department
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

// Assign manager to department
export const assignManager = async (departmentID, managerID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/assign-m/`,
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

// Remove manager from department
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

// Add employee to department
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

// Transfer employee to another department
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

// Get employees by department
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
