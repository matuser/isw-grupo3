const express = require('express');

const InscripcionService = require('./../services/inscripcionService');
const validatorHandler = require('./../middlewares/validatorHandler');
const {
  createInscripcionSchema,
  updateInscripcionSchema,
  getInscripcionSchema,
} = require('./../schemas/inscripcionSchema');

const router = express.Router();
const service = new InscripcionService();

router.get('/', async (req, res, next) => {
  try {
    const inscripciones = await service.find();
    res.json(inscripciones);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getInscripcionSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const inscripcion = await service.findOne(id);
      res.json(inscripcion);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newInscripcion = await service.create(body);
      res.status(201).json(newInscripcion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getInscripcionSchema, 'params'),
  validatorHandler(updateInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const inscripcion = await service.update(id, body);
      res.json(inscripcion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getInscripcionSchema, 'params'),
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
