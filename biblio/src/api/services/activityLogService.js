import api from '../axios';

const activityLogService = {
    getAll: (params) => api.get('/activity-logs', { params }),
    getById: (id) => api.get(`/activity-logs/${id}`),
    getBySubject: (type, id) => api.get(`/activity-logs/subject/${type}/${id}`),
};

export default activityLogService;
