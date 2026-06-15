const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reservaController = require('../controllers/reservaController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);

// Ruta pública para listar reservas
router.get('/reservas', reservaController.listarReservasPorFecha);

module.exports = router;