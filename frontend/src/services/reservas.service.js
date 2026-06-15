import api from './api';

export const getAll = () => api.get('/reservas');
export const getById = (id) => api.get(`/reservas/${id}`);
export const create = (data) => api.post('/reservas', data);
export const update = (id, data) => api.put(`/reservas/${id}`, data);
export const remove = (id) => api.delete(`/reservas/${id}`);
