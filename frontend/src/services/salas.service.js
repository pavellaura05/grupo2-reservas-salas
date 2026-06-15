import api from './api';

export const getAll = () => api.get('/salas');
export const getById = (id) => api.get(`/salas/${id}`);
export const create = (data) => api.post('/salas', data);
export const update = (id, data) => api.put(`/salas/${id}`, data);
export const remove = (id) => api.delete(`/salas/${id}`);
