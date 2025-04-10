const express = require('express');
// Aca se van a importar todos los routers que se van a utilizar en la api
// Ejemplo:
// const usersRouter = require('./usersRouter');


const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router)
  // Ejemplo:
  // router.use('/users', usersRouter);
}

module.exports = routerApi;
