import api from '../axios';

const cahierTemplateService = {
    getAll: (params) => api.get('/cahier-templates', { params }),
    getById: (id) => api.get(`/cahier-templates/${id}`),
    create: (data) => api.post('/cahier-templates', data),
    update: (id, data) => api.put(`/cahier-templates/${id}`, data),
    delete: (id) => api.delete(`/cahier-templates/${id}`),
};

export default cahierTemplateService;
