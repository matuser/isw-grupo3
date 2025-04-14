import api from './api';

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
