const express = require('express');

const ParticipanteService = require('./../services/participanteService');
const validatorHandler = require('./../middlewares/validatorHandler');
const {
  createParticipanteSchema,
  updateParticipanteSchema,
  getParticipanteSchema
} = require('./../schemas/participanteSchema');

const router = express.Router();
const service = new ParticipanteService();

router.get('/', async (req, res, next) => {
  try {
    const participantes = await service.find();
    res.json(participantes);
  } catch (error) {
    next(error);
  }
});

router.get('/:dni/:id_inscripcion',
  validatorHandler(getParticipanteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { dni, id_inscripcion } = req.params;
      const participante = await service.findOne({ dni, id_inscripcion });
      res.json(participante);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createParticipanteSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newParticipante = await service.create(body);
      res.status(201).json(newParticipante);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:dni/:id_inscripcion',
  validatorHandler(getParticipanteSchema, 'params'),
  validatorHandler(updateParticipanteSchema, 'body'),
  async (req, res, next) => {
    try {
      const { dni, id_inscripcion } = req.params;
      const body = req.body;
      const participante = await service.update({ dni, id_inscripcion }, body);
      res.json(participante);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:dni/:id_inscripcion',
  validatorHandler(getParticipanteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { dni, id_inscripcion } = req.params;
      await service.delete({ dni, id_inscripcion });
      res.status(201).json({ dni, id_inscripcion });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
