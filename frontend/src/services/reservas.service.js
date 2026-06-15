import api from './api';

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getAll = (fecha = getToday()) => api.get(`/auth/reservas?fecha=${fecha}`);
export const getById = (id) => api.get(`/reservas/${id}`);
export const create = (data) => api.post('/reservas', data);
export const update = (id, data) => api.put(`/reservas/${id}`, data);
export const remove = (id) => api.delete(`/reservas/${id}`);
