import api from '../axios';

const emailService = {
    send: (data) => api.post('/emails/send', data),
    history: (params) => api.get('/emails/history', { params }),
};

export default emailService;
