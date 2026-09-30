import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { validationResult } from "express-validator";

// Registrar un nuevo administrador
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array(),
        });
    }

    try {
        const { email, password, name } = req.body;

        // Verificar si el administrador ya existe
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({
                success: false,
                message: 'El administrador ya existe con este email',
            });
        }

        // Crear nuevo administrador
        admin = await Admin.create({
            email,
            password,
            name,
        });

        // Crear token JWT
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'jwtsecretkey', {
            expiresIn: '7d',
        });

        res.status(201).json({
            success: true,
            message: 'Administrador registrado exitosamente',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar el administrador',
            error: error.message,
        });
    }
};

// Login de administrador
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array(),
        });
    }

    try {
        const { email, password } = req.body;

        // Buscar el administrador por email e incluir la contraseña
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Verificar la contraseña
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Crear token JWT
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'jwtsecretkey', {
            expiresIn: '7d',
        });

        res.status(200).json({
            success: true,
            message: 'Sesión iniciada exitosamente',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

// Obtener datos del administrador autenticado
export const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);

        res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los datos del administrador',
            error: error.message,
        });
    }
};

export default {
    register,
    login,
    getMe,
};
