const { Model, DataTypes } = require('sequelize');

const VESTIMENTA_TABLE = 'vestimentas';

const VestimentaSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  talla: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'actividades',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
};

class Vestimenta extends Model {
  static associate(models) {
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'id_actividad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: VESTIMENTA_TABLE,
      modelName: 'Vestimenta',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { VESTIMENTA_TABLE, VestimentaSchema, Vestimenta };
