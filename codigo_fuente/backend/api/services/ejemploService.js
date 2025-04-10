// En los servicios se crea la clase Service y se handlea todo lo relacionado con la BD. Esto despues se usa en el routeo (endpoints) para realizar transacciones a la bd

// Dejo un ejemplo generico de como deberia ser un service para un usuario basico

const boom = require('@hapi/boom');

const {models} = require('../libs/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    const rta = await models.User.findAll({
      include: ['customer']
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
