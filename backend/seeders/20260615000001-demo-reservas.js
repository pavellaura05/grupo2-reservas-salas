'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reservas', [
      {
        fecha: '2026-06-15',
        hora_inicio: '10:00:00',
        hora_fin: '12:00:00',
        estado: 'activa',
        UsuarioId: 1,
        SalaId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fecha: '2026-06-15',
        hora_inicio: '14:00:00',
        hora_fin: '16:00:00',
        estado: 'activa',
        UsuarioId: 2,
        SalaId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reservas', null, {});
  }
};
