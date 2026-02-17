import api from "./api";

/**
 * performanceApi.js - Utility for Performance Management Endpoints
 */

export const addPerformance = async (performanceData) => {
    const response = await api.post("/performance/add", performanceData);
    return response.data;
};

export const getAllPerformances = async () => {
    const response = await api.get("/performance");
    return response.data;
};

export const getPerformanceByEmployee = async (employeeID) => {
    const response = await api.get(`/performance/employee/${employeeID}`);
    return response.data;
};

export const updatePerformance = async (id, performanceData) => {
    const response = await api.put(`/performance/update/${id}`, performanceData);
    return response.data;
};

export const deletePerformance = async (id) => {
    const response = await api.delete(`/performance/${id}`);
    return response.data;
};

export default {
    addPerformance,
    getAllPerformances,
    getPerformanceByEmployee,
    updatePerformance,
    deletePerformance
};
