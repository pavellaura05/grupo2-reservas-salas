const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const salaController = require('../controllers/salaController');

// Rutas públicas (sin autenticación)
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);
router.get('/salas', salaController.listarSalas);
router.get('/salas/:id/disponibilidad', salaController.verificarDisponibilidad);

module.exports = router;
