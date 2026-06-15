const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./apps');
const db = require('../models');

const PORT = process.env.PORT || 3001;

// Sincronizar BD y luego levantar servidor
db.sequelize.sync({ alter: false }).then(() => {
  console.log('Base de datos sincronizada correctamente');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});