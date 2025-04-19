const express = require('express');

const VestimentaService = require('./../services/vestimentaService');
const { Vestimenta } = require('../db/models/vestimentaModel');

const router = express.Router();
const service = new VestimentaService();

router.get('/', async (req, res, next) => {
  try {
    const vestimentas = await service.find();
    res.json(vestimentas);
  } catch (error) {
    next(error);
  }
});

router.get('/por-actividad', async (req, res, next) => {
  try {
    const { id_actividad } = req.query;

    if (!id_actividad) {
      return res.status(400).json({ message: 'id_actividad es requerido' });
    }

    const vestimentas = await service.findByActividadId(id_actividad);
    res.json(vestimentas);
  } catch (error) {
    next(error);
  }
});


module.exports = router;