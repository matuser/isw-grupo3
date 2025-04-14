const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class HorarioActividadService {
  constructor() {}

  async create(data) {
    const newHorario = await models.HorarioActividad.create(data);
    return newHorario;
  }

  async find() {
    const horarios = await models.HorarioActividad.findAll({
      include: ['actividad'] // Hace match con el alias definido en el modelo
    });
    return horarios;
  }

  async findOne(id) {
    const horario = await models.HorarioActividad.findByPk(id, {
      include: ['actividad']
    });
    if (!horario) {
      throw boom.notFound('Horario de actividad no encontrado');
    }
    return horario;
  }

  async update(id, changes) {
    const horario = await this.findOne(id);
    const rta = await horario.update(changes);
    return rta;
  }

  async delete(id) {
    const horario = await this.findOne(id);
    await horario.destroy();
    return { id };
  }
}

module.exports = HorarioActividadService;
