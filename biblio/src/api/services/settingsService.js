import api from '../axios';

const settingsService = {
    getAll: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
};

export default settingsService;
