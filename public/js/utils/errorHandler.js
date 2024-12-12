// Error handler utility
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.data);
        return {
            message: error.response.data.message || 'An error occurred',
            status: error.response.status
        };
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request);
        return {
            message: 'Network error. Please check your connection.',
            status: 0
        };
    } else {
        // Error in request setup
        console.error('Request Error:', error.message);
        return {
            message: 'Failed to make request',
            status: -1
        };
    }
};