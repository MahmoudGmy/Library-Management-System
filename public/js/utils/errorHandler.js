
export const handleApiError = (error) => {
    if (error.response) {

        console.error('API Error:', error.response.data);
        return {
            message: error.response.data.message || 'An error occurred',
            status: error.response.status
        };
    } else if (error.request) {
        console.error('Network Error:', error.request);
        return {
            message: 'Network error. Please check your connection.',
            status: 0
        };
    } else {
        console.error('Request Error:', error.message);
        return {
            message: 'Failed to make request',
            status: -1
        };
    }
};