import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Assuming api.js adds the token to headers
                    const response = await api.get('/users/me');
                    setUser(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, data: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (email, password, name) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            const { token, data: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
