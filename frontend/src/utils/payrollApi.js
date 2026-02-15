import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payroll';

// Generate payroll for a single employee
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

// Generate bulk payroll for all employees
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

// Get all payroll records (admin only)
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

// Get payroll records for a specific employee
export const getEmployeePayrolls = async (employeeID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/get`, {
            params: { employeeID }, // Changed to GET with params
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get single salary slip
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

// Download payslip as PDF
export const downloadPayslip = async (payrollID, employeeName, month, year) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/payslip/${payrollID}`, {
            responseType: 'blob', // Important for PDF
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Payslip_${employeeName}_${month}_${year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete payroll record
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
