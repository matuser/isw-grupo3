const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ActividadService {
  constructor() {}

  async create(data) {
    const newActividad = await models.Actividad.create(data);
    return newActividad;
  }

  async find() {
    const actividades = await models.Actividad.findAll({
      include: ['horarios'] // Esto hace match con el alias definido en el modelo
    });
    return actividades;
  }

  async findOne(id) {
    const actividad = await models.Actividad.findByPk(id, {
      include: ['horarios']
    });
    if (!actividad) {
      throw boom.notFound('Actividad no encontrada');
    }
    return actividad;
  }

  async update(id, changes) {
    const actividad = await this.findOne(id);
    const rta = await actividad.update(changes);
    return rta;
  }

  async delete(id) {
    const actividad = await this.findOne(id);
    await actividad.destroy();
    return { id };
  }
}

module.exports = ActividadService;
