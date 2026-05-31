import api from '../axios';

const seasonsService = {
  getAll: (params) => api.get('/seasons', { params }),
  getById: (id) => api.get(`/seasons/${id}`),
  create: (data) => api.post('/seasons', data),
  update: (id, data) => api.put(`/seasons/${id}`, data),
  delete: (id) => api.delete(`/seasons/${id}`),
  // Canonical activation contract: { season_id: string (UUID), is_active: boolean }
  isActive: (params) => api.get(`/seasons/active`, { params }),
  setActive: (data) => api.post(`/seasons/set-active`, data),
};

export default seasonsService;