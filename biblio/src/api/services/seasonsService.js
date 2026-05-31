import api from '../axios';

const seasonsService = {
  getAll: (params) => api.get('/seasons', { params }),
  getById: (id) => api.get(`/seasons/${id}`),
  create: (data) => api.post('/seasons', data),
  update: (id, data) => api.put(`/seasons/${id}`, data),
  delete: (id) => api.delete(`/seasons/${id}`),
  active: (params) => api.post(`/seasons/active`, { params }),
  setActive: (data) => api.post(`/seasons/set-active`, data),
};

export default seasonsService;