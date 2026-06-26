import api from '../axios';

const representantSeasonService = {
    getForRep: (id) => api.get(`/representants/${id}/seasons`),
    update: (repId, seasonId, data) => api.put(`/representants/${repId}/seasons/${seasonId}`, data),
    sync: (repId, data) => api.post(`/representants/${repId}/seasons`, data),
    delete: (repId, seasonId) => api.delete(`/representants/${repId}/seasons/${seasonId}`),
};

export default representantSeasonService;
