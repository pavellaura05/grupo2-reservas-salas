const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas de reservas requieren autenticación
router.use(authMiddleware);

router.post('/', reservaController.crearReserva);
router.get('/', reservaController.listarReservas);
router.get('/:id', reservaController.obtenerReserva);
router.put('/:id', reservaController.actualizarReserva);
router.delete('/:id', reservaController.cancelarReserva);

module.exports = router;