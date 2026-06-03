import api from '../axios';

const invitationService = {
    create: (data) => api.post('/invitations', data),
    getAll: (params) => api.get('/invitations', { params }),
    accept: (data) => api.post('/invitations/accept', data),
};

export default invitationService;
