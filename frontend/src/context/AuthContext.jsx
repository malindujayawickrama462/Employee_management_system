/**
 * AuthContext.jsx - Global Authentication Management
 * 
 * Provides centralized state and functions for user login, logout,
 * registration, and session persistence via JWT verification.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

// Custom hook for easy access to auth data across components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Effect: Session Recovery
     * Runs on startup to verify if a valid token exists in localStorage.
     */
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Attempt to fetch current user details using the stored token
                    const response = await api.get("/user/get");
                    if (response.data.success || response.data) {
                        setUser(response.data);
                    } else {
                        // Cleanup if token is invalid
                        setUser(null);
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Auth verification failed", error);
                    setUser(null);
                    localStorage.removeItem("token");
                }
            }
            // Ensure loading state is turned off regardless of result
            setLoading(false);
        };
        verifyUser();
    }, []);

    /**
     * login - Processes credentials and stores JWT
     * @param {string} email 
     * @param {string} password 
     */
    const login = async (email, password) => {
        try {
            const { data } = await api.post("/user/login", { email, password });
            if (data.success || data.token) {
                setUser(data);
                localStorage.setItem("token", data.token);
                return { success: true, data };
            }
            return { success: false, error: data.msg };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || "Login failed"
            };
        }
    };

    /**
     * register - Creates a new employee/user identity
     */
    const register = async (name, email, password, confirmPassword) => {
        try {
            const { data } = await api.post("/user/add", { name, email, password, role: "employee" });
            if (data.success || data._id) {
                return { success: true, data };
            }
            return { success: false, error: data.msg };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || "Registration failed"
            };
        }
    }

    /**
     * logout - Clears user state and terminates session token
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
