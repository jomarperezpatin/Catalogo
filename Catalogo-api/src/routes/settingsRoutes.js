import { Router } from 'express';
import { getWhatsApp, updateWhatsApp } from '../controllers/settingsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Public — clients need to read the admin's WhatsApp number
router.get('/whatsapp', getWhatsApp);

// Protected — only admins can change it
router.put('/whatsapp', verifyToken, updateWhatsApp);

export default router;
