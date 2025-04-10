// En este archivo se valida los datos ingresados en un post o put, para asegurarse que cumplan con el esquema definido en el modelo de datos. Se utiliza Joi para validar los datos y se define un middleware que se encarga de validar los datos antes de enviarlos a la base de datos. Si los datos no cumplen con el esquema, se devuelve un error 400 Bad Request al cliente.

const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property]
    const {error} = schema.validate(data, {abortEarly: false}); // abortEarly: false para que muestre todos los errores, y no solo el primero
    if (error) {
      next(boom.badRequest(error));
    } else {
      next();
    }
  }
}

module.exports = validatorHandler;
