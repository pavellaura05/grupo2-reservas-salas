import api from './api';

export const getAll = () => api.get('/usuarios');
export const getById = (id) => api.get(`/usuarios/${id}`);
export const create = (data) => api.post('/usuarios', data);
export const update = (id, data) => api.put(`/usuarios/${id}`, data);
export const remove = (id) => api.delete(`/usuarios/${id}`);
