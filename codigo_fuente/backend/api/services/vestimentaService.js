const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class VestimentaService {
  constructor() {}

  async create(data) {
    const newVestimenta = await models.Vestimenta.create(data);
    return newVestimenta;
  }

  async find() {
    const vestimentas = await models.Vestimenta.findAll({
      include: ['actividad'] // ✅ Match con el alias definido en el modelo Vestimenta
    });
    return vestimentas;
  }

  async findByActividadId(idActividad) {
    const vestimentas = await models.Vestimenta.findAll({
      where: {
        id_actividad: idActividad
      }
    });
    return vestimentas;
  }
  
  async findOne(id) {
    const vestimenta = await models.Vestimenta.findByPk(id, {
      include: ['actividad'] // ✅ Aquí también
    });
    if (!vestimenta) {
      throw boom.notFound('Vestimenta no encontrada');
    }
    return vestimenta;
  }

  async update(id, changes) {
    const vestimenta = await this.findOne(id);
    const rta = await vestimenta.update(changes);
    return rta;
  }

  async delete(id) {
    const vestimenta = await this.findOne(id);
    await vestimenta.destroy();
    return { id };
  }
}

module.exports = VestimentaService;
