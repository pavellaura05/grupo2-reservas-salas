const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

router.get('/', salaController.listarSalas);
router.get('/:id/disponibilidad', salaController.verificarDisponibilidad);

module.exports = router;