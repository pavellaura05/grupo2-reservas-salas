'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reserva.belongsTo(models.Usuario);
      Reserva.belongsTo(models.Sala);
    }
  }
  Reserva.init({
    fecha: DataTypes.DATEONLY,
    hora_inicio: DataTypes.TIME,
    hora_fin: DataTypes.TIME,
    estado: {
       type: DataTypes.ENUM('activa', 'cancelada'),
       defaultValue: 'activa'
    }
  }, {
    sequelize,
    modelName: 'Reserva',
  });
  return Reserva;
};