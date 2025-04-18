const express = require('express');

const actividadRouter = require('./actividadRouter');
const horarioActividadRouter = require('./horarioActividadRouter');
const inscripcionRouter = require('./inscripcionRouter');
const participanteRouter = require('./participanteRouter');
const vestimentaRouter = require('./vestimentaRouter');

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/actividades', actividadRouter);
  router.use('/horarios-actividades', horarioActividadRouter);
  router.use('/inscripciones', inscripcionRouter);
  router.use('/participantes', participanteRouter);
  router.use('/vestimentas', vestimentaRouter);
};

module.exports = routerApi;
