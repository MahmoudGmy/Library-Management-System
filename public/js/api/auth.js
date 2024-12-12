import { API_ENDPOINTS } from './config.js';

export const AuthService = {
    // Login
    async login(credentials) {
        try {
            const response = await fetch(API_ENDPOINTS.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    // Register
    async register(userData) {
        try {
            const response = await fetch(API_ENDPOINTS.auth.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Registration failed');
            return await response.json();
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};