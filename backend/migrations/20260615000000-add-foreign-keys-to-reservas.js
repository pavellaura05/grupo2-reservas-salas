'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reservas', 'UsuarioId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    await queryInterface.addColumn('Reservas', 'SalaId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Salas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reservas', 'UsuarioId');
    await queryInterface.removeColumn('Reservas', 'SalaId');
  }
};
