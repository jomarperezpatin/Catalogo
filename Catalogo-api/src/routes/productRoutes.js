import express from "express";
import { body } from "express-validator";
import productController from "../controllers/productController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);

// Rutas protegidas (requieren autenticación de administrador)
router.post(
    '/',
    verifyToken,
    [
        body('name', 'El nombre es requerido').notEmpty(),
        body('description', 'La descripción es requerida').notEmpty(),
        body('price', 'El precio debe ser un número').isFloat({ min: 0 }),
        body('imagesUrl', 'Las imágenes deben ser una lista').optional().isArray(),
        body('category', 'La categoría es requerida').optional(),
        body('stock', 'El stock debe ser un número').optional().isInt({ min: 0 }),
    ],
    productController.createProduct
);

router.put(
    '/:id',
    verifyToken,
    [
        body('name', 'El nombre es requerido').optional().notEmpty(),
        body('description', 'La descripción es requerida').optional().notEmpty(),
        body('price', 'El precio debe ser un número').optional().isFloat({ min: 0 }),
        body('imagesUrl', 'Las imágenes deben ser una lista').optional().isArray(),
        body('category', 'La categoría es requerida').optional(),
        body('stock', 'El stock debe ser un número').optional().isInt({ min: 0 }),
    ],
    productController.updateProduct
);

router.delete('/:id', verifyToken, productController.deleteProduct);

export default router;
