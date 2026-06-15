'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Usuario Test',
        email: 'usuario@example.com',
        password: hashedPassword,
        rol: 'usuario',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
