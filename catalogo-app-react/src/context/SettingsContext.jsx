import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../service/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // On mount, fetch the WhatsApp number from the backend API
  useEffect(() => {
    const fetchWhatsApp = async () => {
      try {
        const data = await settingsService.getWhatsApp();
        if (data?.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      } catch (err) {
        console.warn('No se pudo obtener el número de WhatsApp del servidor:', err);
        // Fallback: try localStorage (for backwards compatibility)
        const local = localStorage.getItem('catalog_whatsapp');
        if (local) setWhatsappNumber(local);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWhatsApp();
  }, []);

  // Clean phone number: extract digits and ensure Mexico country code
  const sanitizePhoneNumber = (rawInput) => {
    if (!rawInput) return '';

    // If it's a URL, extract the number
    const urlMatch = rawInput.match(/(?:wa\.me\/|phone=|send\?phone=)(\d+)/i);
    let digits = urlMatch ? urlMatch[1] : rawInput.replace(/[^\d]/g, '');

    // If it's a 10-digit number (Mexico), prepend 52
    if (digits.length === 10) {
      digits = '52' + digits;
    }

    return digits;
  };

  // Build clean wa.me URL
  const getWhatsAppUrl = (customText = '') => {
    const cleanNumber = sanitizePhoneNumber((whatsappNumber || '').trim());
    const encoded = customText ? encodeURIComponent(customText) : '';

    if (cleanNumber) {
      return encoded
        ? `https://wa.me/${cleanNumber}?text=${encoded}`
        : `https://wa.me/${cleanNumber}`;
    }

    return encoded
      ? `https://wa.me/?text=${encoded}`
      : `https://wa.me/`;
  };

  // Admin updates WhatsApp — saves to the API backend (database)
  const updateWhatsAppNumber = async (newNumber) => {
    const cleaned = newNumber.trim();
    try {
      await settingsService.updateWhatsApp(cleaned);
      setWhatsappNumber(cleaned);
      // Also keep in localStorage as backup
      localStorage.setItem('catalog_whatsapp', cleaned);
      return { success: true };
    } catch (err) {
      console.error('Error guardando WhatsApp:', err);
      // Fallback to localStorage only
      setWhatsappNumber(cleaned);
      localStorage.setItem('catalog_whatsapp', cleaned);
      return { success: false, error: err.message };
    }
  };

  const value = {
    whatsappNumber,
    cleanWhatsAppNumber: sanitizePhoneNumber(whatsappNumber),
    setWhatsappNumber,
    updateWhatsAppNumber,
    getWhatsAppUrl,
    isLoading,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
