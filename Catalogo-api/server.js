import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Only start HTTP server in local development.
// On Vercel (serverless), the exported app is used directly as a handler.
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en puerto ${PORT}`);
        console.log(`URL: http://localhost:${PORT}`);
    });
}

export default app;
