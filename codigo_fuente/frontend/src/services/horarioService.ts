import api from './api';
import axios from 'axios';

export const getHorarios = async () => {
  const response = await api.get('/horarios-actividades');
  return response.data;
};

export const getHorarioById = async (id: number) => {
  const response = await api.get(`/horarios-actividades/${id}`);
  return response.data;
};

export const createHorario = async (horario: {
  id_actividad: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_disponible: number;
  cupo_maximo: number;
}) => {
  const response = await api.post('/horarios-actividades', horario);
  return response.data;
};

export const updateHorario = async (id: number, horario: any) => {
  const response = await api.patch(`/horarios-actividades/${id}`, horario);
  return response.data;
};

export const deleteHorario = async (id: number) => {
  const response = await api.delete(`/horarios-actividades/${id}`);
  return response.data;
};

export const getFechasDisponibles = async (id_actividad: number, cantidad_personas: number) => {
  const response = await api.get('/horarios-actividades/fechas-disponibles', {
    params: {
      id_actividad,
      cantidad_personas
    }
  });
  return response.data; // Array de fechas disponibles (ej: ['2025-04-20', '2025-04-22'])
};

export const getHorariosDisponibles = async (
  id_actividad: number,
  fecha: string,
  cantidad_personas: number
) => {
  const response = await axios.get('/horarios-disponibles', {
    params: { id_actividad, fecha, cantidad_personas },
  });
  return response.data;
};