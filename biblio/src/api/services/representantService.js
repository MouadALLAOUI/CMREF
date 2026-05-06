import api from '../axios';

const representantService = {
    getAll: (params) => api.get('/representants', { params }),
    getById: (id) => api.get(`/representants/${id}`),
    create: (data) => api.post('/representants', data),
    update: (id, data) => api.put(`/representants/${id}`, data),
    delete: (id) => api.delete(`/representants/${id}`),
    active_compte: (data) => api.post(`/active_compte`, data)
};

export default representantService;
