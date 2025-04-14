const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class InscripcionService {
  constructor() {}

  async create(data) {
    const newInscripcion = await models.Inscripcion.create(data);
    return newInscripcion;
  }

  async find() {
    const inscripciones = await models.Inscripcion.findAll({
      include: ['horario', 'participantes'] // Aliases definidos en el modelo
    });
    return inscripciones;
  }

  async findOne(id) {
    const inscripcion = await models.Inscripcion.findByPk(id, {
      include: ['horario', 'participantes']
    });
    if (!inscripcion) {
      throw boom.notFound('Inscripción no encontrada');
    }
    return inscripcion;
  }

  async update(id, changes) {
    const inscripcion = await this.findOne(id);
    const rta = await inscripcion.update(changes);
    return rta;
  }

  async delete(id) {
    const inscripcion = await this.findOne(id);
    await inscripcion.destroy();
    return { id };
  }
}

module.exports = InscripcionService;
