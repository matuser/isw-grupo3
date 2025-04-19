const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize');

class HorarioActividadService {
  constructor() {}

  async create(data) {
    const newHorario = await models.HorarioActividad.create(data);
    return newHorario;
  }

  async find(cantidadPersonas) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
  
    const where = {
      fecha: {
        [Op.between]: [today, maxDate]
      }
    };
  
    if (cantidadPersonas) {
      where.cupo_disponible = {
        [Op.gte]: cantidadPersonas
      };
    }
  
    const horarios = await models.HorarioActividad.findAll({
      where,
      include: ['actividad']
    });
  
    return horarios;
  }

  async findFechasDisponibles(idActividad, cantidadPersonas) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
  
    const horarios = await models.HorarioActividad.findAll({
      where: {
        id_actividad: idActividad,
        cupo_disponible: {
          [Op.gte]: cantidadPersonas
        },
        fecha: {
          [Op.between]: [today, maxDate]
        }
      },
      attributes: ['fecha'],
      group: ['fecha'],
      raw: true
    });
  
    return horarios.map(h => h.fecha); // solo devolvemos array de fechas
  }
  
  async findHorariosPorFecha(idActividad, fecha, cantidadPersonas) {
    const horarios = await models.HorarioActividad.findAll({
      where: {
        id_actividad: idActividad,
        fecha: fecha,
        cupo_disponible: {
          [Op.gte]: cantidadPersonas
        }
      },
      include: ['actividad']
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
