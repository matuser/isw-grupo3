const { Model, DataTypes } = require('sequelize');

const INSCRIPCION_TABLE = 'inscripciones';

const InscripcionSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  id_horario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'horarios_actividades',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  cantidad_personas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inscripcion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
};

class Inscripcion extends Model {
  static associate(models) {
    this.belongsTo(models.HorarioActividad, {
      as: 'horario',
      foreignKey: 'id_horario'
    });

    this.hasMany(models.Participante, {
      as: 'participantes',
      foreignKey: 'id_inscripcion'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: INSCRIPCION_TABLE,
      modelName: 'Inscripcion',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { INSCRIPCION_TABLE, InscripcionSchema, Inscripcion };
