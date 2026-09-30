import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Registrar un nuevo administrador
router.post(
    '/register',
    [
        body('email', 'Por favor proporciona un email válido').isEmail(),
        body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
        body('name', 'El nombre es requerido').notEmpty(),
    ],
    authController.register
);

// Login
router.post(
    '/login',
    [
        body('email', 'Por favor proporciona un email válido').isEmail(),
        body('password', 'La contraseña es requerida').notEmpty(),
    ],
    authController.login
);

// Obtener datos del administrador autenticado
router.get('/me', verifyToken, authController.getMe);

export default router;
