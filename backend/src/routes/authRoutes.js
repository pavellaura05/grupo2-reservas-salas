const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);
router.put('/usuarios/:id', authController.updateUser);
router.delete('/usuarios/:id', authController.deleteUser);

module.exports = router;