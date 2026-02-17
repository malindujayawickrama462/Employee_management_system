import api from "./api";

/**
 * analyticsApi.js - Utility for Analytics Endpoints
 */

export const getOverviewStats = async () => {
    const response = await api.get("/analytics/overview");
    return response.data;
};

export const getDepartmentStats = async () => {
    const response = await api.get("/analytics/departments");
    return response.data;
};

export const getPayrollTrends = async () => {
    const response = await api.get("/analytics/payroll-trends");
    return response.data;
};

export const getRoleDistribution = async () => {
    const response = await api.get("/analytics/roles");
    return response.data;
};

export const getIndividualReport = async (employeeID) => {
    const response = await api.get(`/analytics/report/${employeeID}`);
    return response.data;
};

export default {
    getOverviewStats,
    getDepartmentStats,
    getPayrollTrends,
    getRoleDistribution,
    getIndividualReport
};

