// Este schema no se usa pero es buena practica definirlo igual

const Joi = require('joi');

const id = Joi.number().integer().required();

const getVestimentaSchema = Joi.object({
  id
});

module.exports = {
  getVestimentaSchema
};