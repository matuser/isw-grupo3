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

module.exports = router;