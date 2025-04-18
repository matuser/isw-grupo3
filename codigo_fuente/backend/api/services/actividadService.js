const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize');

class ActividadService {
  constructor() {}

  async create(data) {
    const newActividad = await models.Actividad.create(data);
    return newActividad;
  }

  async find() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);

    const actividades = await models.Actividad.findAll({
      include: [
        {
          association: 'horarios',
          where: {
            fecha: {
              [Op.between]: [today, maxDate]
            }
          },
          required: false // si querés incluir actividades aunque no tengan horarios en ese rango
        }
      ]
    });
    return actividades;
  }

  async findOne(id) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);

    const actividad = await models.Actividad.findByPk(id, {
      include: [
        {
          association: 'horarios',
          where: {
            fecha: {
              [Op.between]: [today, maxDate]
            }
          },
          required: false
        }
      ]
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
