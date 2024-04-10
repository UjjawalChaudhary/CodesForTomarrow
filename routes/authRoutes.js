const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/login', [

    body('username').notEmpty().trim().escape(),
    body('password').notEmpty().trim()
], validationMiddleware, authController.login);

router.post('/logout', authController.logout);

module.exports = router;