import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API del Catálogo activa y funcionando',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            auth: '/api/auth'
        }
    });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'El servidor está funcionando correctamente',
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message,
    });
});

export default app;