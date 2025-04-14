import api from './api';

export const getInscripciones = async () => {
  const response = await api.get('/inscripciones');
  return response.data;
};

export const getInscripcionById = async (id: number) => {
  const response = await api.get(`/inscripciones/${id}`);
  return response.data;
};

export const createInscripcion = async (inscripcion: {
  id_horario: number;
  cantidad_personas: number;
  fecha_inscripcion: string;
}) => {
  const response = await api.post('/inscripciones', inscripcion);
  return response.data;
};

export const updateInscripcion = async (id: number, inscripcion: any) => {
  const response = await api.patch(`/inscripciones/${id}`, inscripcion);
  return response.data;
};

export const deleteInscripcion = async (id: number) => {
  const response = await api.delete(`/inscripciones/${id}`);
  return response.data;
};
