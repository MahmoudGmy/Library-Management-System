import { API_ENDPOINTS } from './config.js';

export const FineService = {
    // Get all fines
    async getAllFines() {
        try {
            const response = await fetch(API_ENDPOINTS.fines);
            if (!response.ok) throw new Error('Failed to fetch fines');
            return await response.json();
        } catch (error) {
            console.error('Error fetching fines:', error);
            throw error;
        }
    },

    // Get fines by member ID
    async getFinesByMember(memberId) {
        try {
            const response = await fetch(`${API_ENDPOINTS.fines}?member_id=${memberId}`);
            if (!response.ok) throw new Error('Failed to fetch member fines');
            return await response.json();
        } catch (error) {
            console.error('Error fetching member fines:', error);
            throw error;
        }
    },

    // Pay fine
    async payFine(fineId, paymentData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.fines}/${fineId}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });
            if (!response.ok) throw new Error('Failed to process fine payment');
            return await response.json();
        } catch (error) {
            console.error('Error paying fine:', error);
            throw error;
        }
    }
};