import api from './api';

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getAll = (fecha = null) => {
  const url = fecha ? `/reservas?fecha=${fecha}` : '/reservas';
  return api.get(url);
};
export const getById = (id) => api.get(`/reservas/${id}`);
export const create = (data) => api.post('/reservas', data);
export const update = (id, data) => api.put(`/reservas/${id}`, data);
export const remove = (id) => api.delete(`/reservas/${id}`);
