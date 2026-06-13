'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Salas', [
      {
        nombre: 'Sala A',
        capacidad: 20,
        tiene_proyector: true,
        disponible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Sala B',
        capacidad: 10,
        tiene_proyector: false,
        disponible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Sala C',
        capacidad: 30,
        tiene_proyector: true,
        disponible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Salas', null, {});
  }
};