import api from './api';

export const getParticipantes = async () => {
  const response = await api.get('/participantes');
  return response.data;
};

export const getParticipanteById = async (dni: string, id_inscripcion: number) => {
  const response = await api.get(`/participantes/${dni}/${id_inscripcion}`);
  return response.data;
};

export const createParticipante = async (participante: {
  dni: string;
  id_inscripcion: number;
  nombre: string;
  edad: number;
  talla_vestimenta?: string;
}) => {
  const response = await api.post('/participantes', participante);
  return response.data;
};

export const updateParticipante = async (
  dni: string,
  id_inscripcion: number,
  cambios: any
) => {
  const response = await api.patch(`/participantes/${dni}/${id_inscripcion}`, cambios);
  return response.data;
};

export const deleteParticipante = async (dni: string, id_inscripcion: number) => {
  const response = await api.delete(`/participantes/${dni}/${id_inscripcion}`);
  return response.data;
};
