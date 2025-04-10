// Utilizando la libreria Joi para validar los datos de entrada en la API. Joi es una libreria de validacion de datos que permite definir un esquema de validacion y luego validar los datos de entrada contra ese esquema. En este caso, se esta definiendo un esquema para validar los datos de entrada de un usuario, incluyendo el email, password y role. Se utiliza Joi para validar los datos y se exporta el esquema para ser utilizado en otros archivos.

// Esto es un ejemplo de como se deberia utilizar Joi, para un modelo de usuario generico

const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5)

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required()
});

const updateUserSchema = Joi.object({
  email: email,
  role: role,
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
