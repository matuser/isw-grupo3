const { Model, DataTypes } = require('sequelize');

const ACTIVIDAD_TABLE = 'actividades';

const ActividadSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  terminos_condiciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requiere_talla: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};

class Actividad extends Model {
  static associate(models) {
    this.hasMany(models.HorarioActividad, {
      as: 'horarios',
      foreignKey: 'id_actividad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ACTIVIDAD_TABLE,
      modelName: 'Actividad',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { ACTIVIDAD_TABLE, ActividadSchema, Actividad };
