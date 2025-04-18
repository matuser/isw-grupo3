const { Model, DataTypes } = require('sequelize');

const HORARIO_ACTIVIDAD_TABLE = 'horarios_actividades';

const HorarioActividadSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'actividades',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  cupo_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
};

class HorarioActividad extends Model {
  static associate(models) {
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'id_actividad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: HORARIO_ACTIVIDAD_TABLE,
      modelName: 'HorarioActividad',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { HORARIO_ACTIVIDAD_TABLE, HorarioActividadSchema, HorarioActividad };
