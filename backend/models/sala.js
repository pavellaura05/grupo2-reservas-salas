'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sala extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sala.hasMany(models.Reserva);
    }
  }
  Sala.init({
    nombre: DataTypes.STRING,
    capacidad: DataTypes.INTEGER,
    tiene_proyector: DataTypes.BOOLEAN,
    disponible: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Sala',
  });
  return Sala;
};