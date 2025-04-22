const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize');

class HorarioActividadService {
  constructor() { }

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
    const now = new Date();
    const todayStr = now.toLocaleDateString('sv-SE'); // ← usa hora local
    const horaActual = now.toTimeString().slice(0, 5); // 'HH:mm'

    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 30);
    const maxDateStr = maxDate.toLocaleDateString('sv-SE');

    const horarios = await models.HorarioActividad.findAll({
      where: {
        id_actividad: idActividad,
        cupo_disponible: {
          [Op.gte]: cantidadPersonas
        },
        fecha: {
          [Op.between]: [todayStr, maxDateStr]
        }
      },
      raw: true
    });

    const fechasSet = new Set();

    for (const h of horarios) {
      const fechaStr = h.fecha instanceof Date
        ? h.fecha.toLocaleDateString('sv-SE')
        : h.fecha;

      if (fechaStr > todayStr) {
        fechasSet.add(fechaStr);
      } else if (fechaStr === todayStr && h.hora_inicio >= horaActual) {
        fechasSet.add(fechaStr);
      }
    }

    return Array.from(fechasSet).sort();
  }


  async findHorariosPorFecha(idActividad, fecha, cantidadPersonas) {
    const today = new Date().toISOString().split('T')[0];

    const whereClause = {
      id_actividad: idActividad,
      fecha,
      cupo_disponible: {
        [Op.gte]: cantidadPersonas
      }
    };

    if (fecha === today) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0); // redondea a la siguiente hora en punto
      now.setSeconds(0);
      now.setMilliseconds(0);

      const horaRedondeada = now.toTimeString().slice(0, 5); // 'HH:mm'

      whereClause.hora_inicio = {
        [Op.gte]: horaRedondeada
      };
    }

    const horarios = await models.HorarioActividad.findAll({
      where: whereClause,
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
