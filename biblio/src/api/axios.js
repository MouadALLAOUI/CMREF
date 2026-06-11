import axios from 'axios';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/useAppStore';
import logger from '../lib/logger';
import { getCsrfCookieUrl } from '../utils/helpers';

const CSRF_COOKIE_URL = getCsrfCookieUrl();

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

instance.fetchCsrfCookie = async () => {
    return axios.get(CSRF_COOKIE_URL, { withCredentials: true });
};

instance.interceptors.request.use((config) => {
    const token = useAppStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const { activeSeason } = useAppStore.getState();
    if (activeSeason?.label) {
        config.params = { annee: activeSeason.label, ...config.params };
    }
    useAppStore.getState().startApiCall();
    return config;
});

// Interceptor to handle global errors
instance.interceptors.response.use(
    (response) => {
        useAppStore.getState().endApiCall();
        const body = response.data;
        const hasPageParam = response.config?.params?.page !== undefined;
        // Paginated request (has ?page=): return full { data, meta } for fetchAllPaginated
        if (hasPageParam && body && typeof body === 'object' && body.meta && Array.isArray(body.data)) {
            return body;
        }
        // Default: unwrap to array for backward compatibility with MyTable
        if (body && typeof body === 'object' && body.meta && Array.isArray(body.data)) {
            return body.data;
        }
        return body?.data || body || [];
    },
    (error) => {
        useAppStore.getState().endApiCall();
        logger({ "Axios Interceptor Error": error }, "error")();
        const { response, config } = error;
        if (response) {
            logger({ "Axios Error Status": response.status, "Error Response Data": response.data }, "error")();
            switch (response.status) {
                case 401:
                    // Clear auth state and redirect to login
                    if (!config.url.includes('/logout')) {
                        logger({ "Unauthorized — redirecting to login": config.url }, "warn")();
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