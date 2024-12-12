import { API_ENDPOINTS } from './config.js';

export const BorrowService = {
    // Get all borrows
    async getAllBorrows() {
        try {
            const response = await fetch(API_ENDPOINTS.borrows);
            if (!response.ok) throw new Error('Failed to fetch borrows');
            return await response.json();
        } catch (error) {
            console.error('Error fetching borrows:', error);
            throw error;
        }
    },

    // Get borrows by member ID
    async getBorrowsByMember(memberId) {
        try {
            const response = await fetch(`${API_ENDPOINTS.borrows}?member_id=${memberId}`);
            if (!response.ok) throw new Error('Failed to fetch member borrows');
            return await response.json();
        } catch (error) {
            console.error('Error fetching member borrows:', error);
            throw error;
        }
    },

    // Create new borrow
    async createBorrow(borrowData) {
        try {
            const response = await fetch(API_ENDPOINTS.borrows, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(borrowData)
            });
            if (!response.ok) throw new Error('Failed to create borrow');
            return await response.json();
        } catch (error) {
            console.error('Error creating borrow:', error);
            throw error;
        }
    },

    // Return book
    async returnBook(borrowId, returnData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.borrows}/${borrowId}/return`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(returnData)
            });
            if (!response.ok) throw new Error('Failed to return book');
            return await response.json();
        } catch (error) {
            console.error('Error returning book:', error);
            throw error;
        }
    }
};