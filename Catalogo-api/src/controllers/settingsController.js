import Settings from '../models/Settings.js';

// GET /api/settings/whatsapp — Public: anyone can read the configured WhatsApp number
export const getWhatsApp = async (req, res) => {
    try {
        const value = await Settings.getValue('whatsapp_number', '');
        res.status(200).json({ success: true, whatsappNumber: value });
    } catch (error) {
        console.error('Error obteniendo WhatsApp:', error);
        res.status(500).json({ success: false, message: 'Error al obtener configuración' });
    }
};

// PUT /api/settings/whatsapp — Protected: only admins can update
export const updateWhatsApp = async (req, res) => {
    try {
        const { whatsappNumber } = req.body;
        if (whatsappNumber === undefined || whatsappNumber === null) {
            return res.status(400).json({ success: false, message: 'Se requiere el campo whatsappNumber' });
        }
        await Settings.setValue('whatsapp_number', whatsappNumber.trim());
        res.status(200).json({ success: true, message: 'Número de WhatsApp actualizado', whatsappNumber: whatsappNumber.trim() });
    } catch (error) {
        console.error('Error actualizando WhatsApp:', error);
        res.status(500).json({ success: false, message: 'Error al guardar configuración' });
    }
};
