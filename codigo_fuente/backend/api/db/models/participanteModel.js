const { Model, DataTypes } = require('sequelize');

const PARTICIPANTE_TABLE = 'participantes';

const ParticipanteSchema = {
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  id_inscripcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'inscripciones',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  talla_vestimenta: {
    type: DataTypes.STRING,
    allowNull: true
  }
};

class Participante extends Model {
  static associate(models) {
    this.belongsTo(models.Inscripcion, {
      as: 'inscripcion',
      foreignKey: 'id_inscripcion'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PARTICIPANTE_TABLE,
      modelName: 'Participante',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { PARTICIPANTE_TABLE, ParticipanteSchema, Participante };
