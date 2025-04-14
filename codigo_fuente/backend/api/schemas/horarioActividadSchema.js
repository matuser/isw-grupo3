const Joi = require('joi');

const id = Joi.number().integer();
const id_actividad = Joi.number().integer();
const fecha = Joi.date().required();
const hora_inicio = Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required();
const hora_fin = Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required();
const cupo_disponible = Joi.number().integer().min(0).required();
const cupo_maximo = Joi.number().integer().min(1).required();

const createHorarioActividadSchema = Joi.object({
  id_actividad: id_actividad.required(),
  fecha,
  hora_inicio,
  hora_fin,
  cupo_disponible,
  cupo_maximo
}).custom((obj, helpers) => {
  if (obj.cupo_disponible > obj.cupo_maximo) {
    return helpers.message('"cupo_disponible" no puede ser mayor que "cupo_maximo"');
  }
  return obj;
});

const updateHorarioActividadSchema = Joi.object({
  id_actividad: id_actividad,
  fecha,
  hora_inicio,
  hora_fin,
  cupo_disponible: Joi.number().integer().min(0),
  cupo_maximo: Joi.number().integer().min(1)
}).custom((obj, helpers) => {
  if (obj.cupo_disponible !== undefined && obj.cupo_maximo !== undefined && obj.cupo_disponible > obj.cupo_maximo) {
    return helpers.message('"cupo_disponible" no puede ser mayor que "cupo_maximo"');
  }
  return obj;
});

const getHorarioActividadSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createHorarioActividadSchema,
  updateHorarioActividadSchema,
  getHorarioActividadSchema
};
