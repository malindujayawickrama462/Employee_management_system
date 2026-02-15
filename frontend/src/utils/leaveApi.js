import axios from 'axios';

const API_URL = 'http://localhost:3000/api/leave';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// Update token before each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const addLeave = async (leaveData) => {
    try {
        const response = await api.post('/add', leaveData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getLeaves = async () => {
    try {
        const response = await api.get('/get');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getEmployeeLeaves = async (employeeID) => {
    try {
        const response = await api.get(`/employee/${employeeID}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateLeaveStatus = async (id, status) => {
    try {
        const response = await api.put(`/update/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
