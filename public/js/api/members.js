import { API_ENDPOINTS } from './config.js';

export const MemberService = {
    // Get all members
    async getAllMembers() {
        try {
            const response = await fetch(API_ENDPOINTS.members);
            if (!response.ok) throw new Error('Failed to fetch members');
            return await response.json();
        } catch (error) {
            console.error('Error fetching members:', error);
            throw error;
        }
    },

    // Get a single member by ID
    async getMemberById(id) {
        try {
            const response = await fetch(`${API_ENDPOINTS.members}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch member');
            return await response.json();
        } catch (error) {
            console.error('Error fetching member:', error);
            throw error;
        }
    },

    // Update member profile
    async updateMember(id, memberData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.members}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberData)
            });
            if (!response.ok) throw new Error('Failed to update member');
            return await response.json();
        } catch (error) {
            console.error('Error updating member:', error);
            throw error;
        }
    }
};