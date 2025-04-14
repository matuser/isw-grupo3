const Joi = require('joi');

const dni = Joi.string().required();
const id_inscripcion = Joi.number().integer().required();
const nombre = Joi.string().min(1);
const edad = Joi.number().integer().min(0);
const talla_vestimenta = Joi.string().allow('', null);

const createParticipanteSchema = Joi.object({
  dni: dni,
  id_inscripcion: id_inscripcion,
  nombre: nombre.required(),
  edad: edad.required(),
  talla_vestimenta: talla_vestimenta
});

const updateParticipanteSchema = Joi.object({
  nombre: nombre,
  edad: edad,
  talla_vestimenta: talla_vestimenta
});

const getParticipanteSchema = Joi.object({
  dni: dni,
  id_inscripcion: id_inscripcion
});

module.exports = {
  createParticipanteSchema,
  updateParticipanteSchema,
  getParticipanteSchema
};
