const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

router.get('/', salaController.listarSalas);
router.get('/:id', salaController.obtenerSala);
router.post('/', salaController.crearSala);
router.put('/:id', salaController.actualizarSala);
router.delete('/:id', salaController.eliminarSala);
router.get('/:id/disponibilidad', salaController.verificarDisponibilidad);

module.exports = router;