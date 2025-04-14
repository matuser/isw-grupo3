const express = require('express');

const HorarioActividadService = require('./../services/horarioActividadService');
const validatorHandler = require('./../middlewares/validatorHandler');
const {
  createHorarioActividadSchema,
  updateHorarioActividadSchema,
  getHorarioActividadSchema,
} = require('./../schemas/horarioActividadSchema');

const router = express.Router();
const service = new HorarioActividadService();

router.get('/', async (req, res, next) => {
  try {
    const items = await service.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getHorarioActividadSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await service.findOne(id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createHorarioActividadSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.create(body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getHorarioActividadSchema, 'params'),
  validatorHandler(updateHorarioActividadSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const item = await service.update(id, body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getHorarioActividadSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
