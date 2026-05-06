import api from '../api/axios';

const rembFactureService = {
  getAll: (params) => api.get('/remboursement-factures', { params }),
  get: (id) => api.get(`/remboursement-factures/${id}`),
  create: (data) => api.post('/remboursement-factures', data),
  update: (id, data) => api.put(`/remboursement-factures/${id}`, data),
  delete: (id) => api.delete(`/remboursement-factures/${id}`),
};

export default rembFactureService;
