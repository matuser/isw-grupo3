const Joi = require('joi');

const id = Joi.number().integer();
const nombre = Joi.string().min(3).max(100);
const terminos_condiciones = Joi.string().allow('', null); 
const requiere_talla = Joi.boolean();

const createActividadSchema = Joi.object({
  nombre: nombre.required(),
  terminos_condiciones: terminos_condiciones,
  requiere_talla: requiere_talla.required()
});

const updateActividadSchema = Joi.object({
  nombre: nombre,
  terminos_condiciones: terminos_condiciones,
  requiere_talla: requiere_talla
});

const getActividadSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createActividadSchema,
  updateActividadSchema,
  getActividadSchema
};
