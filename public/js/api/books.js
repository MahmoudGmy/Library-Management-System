import { API_ENDPOINTS } from './config.js';

export const BookService = {
    // Get all books
    async getAllBooks() {
        try {
            const response = await fetch(API_ENDPOINTS.books);
            if (!response.ok) throw new Error('Failed to fetch books');
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    },

    // Get a single book by ID
    async getBookById(id) {
        try {
            const response = await fetch(`${API_ENDPOINTS.books}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch book');
            return await response.json();
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    // Add a new book
    async addBook(bookData) {
        try {
            const response = await fetch(API_ENDPOINTS.books, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error('Failed to add book');
            return await response.json();
        } catch (error) {
            console.error('Error adding book:', error);
            throw error;
        }
    },

    // Update a book
    async updateBook(id, bookData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.books}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error('Failed to update book');
            return await response.json();
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    },

    // Delete a book
    async deleteBook(id) {
        try {
            const response = await fetch(`${API_ENDPOINTS.books}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete book');
            return await response.json();
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }
};