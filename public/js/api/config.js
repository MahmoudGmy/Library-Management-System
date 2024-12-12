// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const API_ENDPOINTS = {
    books: `${API_BASE_URL}/books`,
    members: `${API_BASE_URL}/members`,
    borrows: `${API_BASE_URL}/borrows`,
    fines: `${API_BASE_URL}/fines`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`
    }
};