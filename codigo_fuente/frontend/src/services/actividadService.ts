// src/services/actividadService.ts
import api from './api';

export const getActividades = async () => {
  const response = await api.get('/actividades');
  return response.data;
};

export const createActividad = async (actividad: {
  nombre: string;
  terminos_condiciones?: string;
  requiere_talla: boolean;
}) => {
  const response = await api.post('/actividades', actividad);
  return response.data;
};
