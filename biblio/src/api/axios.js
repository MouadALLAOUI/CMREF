import axios from 'axios';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/useAppStore';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

instance.interceptors.request.use((config) => {
    // Get token from your Zustand store or localStorage
    const token = useAppStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle global errors
instance.interceptors.response.use(
    (response) => {
        /**
         * Logic to simplify data extraction:
         * 1. Check if the response is successful (already implied here)
         * 2. Return response.data.data (standard Laravel/API nesting)
         * 3. Fallback to response.data (if not nested)
         * 4. Final fallback to empty array (to prevent .map() errors)
         */
        return response.data?.data || response.data || [];
    },
    (error) => {
        console.error("Axios Interceptor Error:", error);
        const { response, config } = error;
        if (response) {
            console.error("Axios Error Status:", response.status);
            console.error("Error Response Data:", response.data);
            switch (response.status) {
                case 401:
                    console.warn("401 Unauthorized detected. Logging out...");
                    // Clear auth state and redirect to login
                    if (!config.url.includes('/logout')) {
                        console.warn("Unauthorized! Redirecting to login...");
                        useAppStore.getState().logout();
                        window.location.href = '/login';
                    }
                    break;
                case 422:
                    // Return the error object for form validation
                    return Promise.reject(error);
                case 500:
                    // Show a generic server error toast
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;