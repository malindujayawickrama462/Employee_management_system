/**
 * api.js - Centralized Axios Configuration
 * 
 * This file exports a configured instance of Axios tailored for the application's
 * backend architecture. It handles:
 * 1. Base URL configuration for internal API services.
 * 2. Automated Token Injection via request interceptors (Bearer authentication).
 */

import axios from "axios";

const api = axios.create({
    // Standardized gateway for all entity-related requests
    baseURL: "http://localhost:3000/api",
});

/**
 * Request Interceptor: Global Session Management
 * 
 * Automatically attaches the 'Authorization' header to every outgoing request
 * if a valid JWT is found in the browser's localStorage. This ensures
 * seamless communication with protected backend routes.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Standardized handling for request preparation failures
        return Promise.reject(error);
    }
);

export default api;
