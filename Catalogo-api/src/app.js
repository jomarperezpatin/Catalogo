import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        // In production, allow same-domain (Vercel) and CORS_ORIGIN env var
        const allowed = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
            : [];
        // Always allow *.vercel.app and localhost in dev
        const isVercel = origin.endsWith('.vercel.app');
        const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
        if (isVercel || isLocal || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // permissive – lock down once you know your domain
        }
    },
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de conexión a la base de datos (vital para Vercel Serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Error de conexión con la base de datos",
            error: error.message
        });
    }
});

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