import api from './api';

export const getAll = () => api.get('/auth/usuarios');
export const getById = (id) => api.get(`/auth/usuarios/${id}`);
export const create = (data) => api.post('/auth/register', data);
export const update = (id, data) => api.put(`/usuarios/${id}`, data);
export const remove = (id) => api.delete(`/usuarios/${id}`);
