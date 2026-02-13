import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await api.get("/user/get"); // confirm endpoint
                    if (response.data.success || response.data) {
                        setUser(response.data);
                    } else {
                        setUser(null);
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Auth verification failed", error);
                    setUser(null);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/user/login", { email, password });
            if (data.success || data.token) { // Adjust based on actual response structure
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

    const register = async (name, email, password, confirmPassword) => {
        try {
            const { data } = await api.post("/user/add", { name, email, password, role: "employee" }); // default role?
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
