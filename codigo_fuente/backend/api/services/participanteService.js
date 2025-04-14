const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ParticipanteService {
  constructor() {}

  async create(data) {
    const newParticipante = await models.Participante.create(data);
    return newParticipante;
  }

  async find() {
    const participantes = await models.Participante.findAll({
      include: ['inscripcion']
    });
    return participantes;
  }

  async findOne(dni, id_inscripcion) {
    const participante = await models.Participante.findOne({
      where: { dni, id_inscripcion },
      include: ['inscripcion']
    });
    if (!participante) {
      throw boom.notFound('Participante no encontrado');
    }
    return participante;
  }

  async update(dni, id_inscripcion, changes) {
    const participante = await this.findOne(dni, id_inscripcion);
    const rta = await participante.update(changes);
    return rta;
  }

  async delete(dni, id_inscripcion) {
    const participante = await this.findOne(dni, id_inscripcion);
    await participante.destroy();
    return { dni, id_inscripcion };
  }
}

module.exports = ParticipanteService;
