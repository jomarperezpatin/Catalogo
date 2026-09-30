import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación',
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');
        req.adminId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token ha expirado',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
        });
    }
};

export default {
    verifyToken,
};