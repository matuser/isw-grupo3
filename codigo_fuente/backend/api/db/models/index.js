const { Actividad, ActividadSchema } = require('./actividadModel');
const { HorarioActividad, HorarioActividadSchema } = require('./horarioActividadModel');
const { Inscripcion, InscripcionSchema } = require('./inscripcionModel');
const { Participante, ParticipanteSchema } = require('./participanteModel');
const { Vestimenta, VestimentaSchema } = require('./vestimentaModel')

function setupModels(sequelize) {
  Actividad.init(ActividadSchema, Actividad.config(sequelize));
  HorarioActividad.init(HorarioActividadSchema, HorarioActividad.config(sequelize));
  Inscripcion.init(InscripcionSchema, Inscripcion.config(sequelize));
  Participante.init(ParticipanteSchema, Participante.config(sequelize));
  Vestimenta.init(VestimentaSchema, Vestimenta.config(sequelize))

  // Relaciones
  Actividad.associate(sequelize.models);
  HorarioActividad.associate(sequelize.models);
  Inscripcion.associate(sequelize.models);
  Participante.associate(sequelize.models);
  Vestimenta.associate(sequelize.models)
}

module.exports = setupModels;