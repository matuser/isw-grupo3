const Joi = require('joi');

const id = Joi.number().integer();
const id_horario = Joi.number().integer();
const cantidad_personas = Joi.number().integer().min(1);
const fecha_inscripcion = Joi.date();

const createInscripcionSchema = Joi.object({
  id_horario: id_horario.required(),
  cantidad_personas: cantidad_personas.required(),
  fecha_inscripcion: fecha_inscripcion.required()
});

const updateInscripcionSchema = Joi.object({
  id_horario: id_horario,
  cantidad_personas: cantidad_personas,
  fecha_inscripcion: fecha_inscripcion
});

const getInscripcionSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createInscripcionSchema,
  updateInscripcionSchema,
  getInscripcionSchema
};

