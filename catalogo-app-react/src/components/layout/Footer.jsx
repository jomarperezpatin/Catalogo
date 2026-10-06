import React from 'react';
import { IconSparkles, IconWhatsApp, IconShield } from '../common/Icons';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { isAdmin, openAuthModal } = useAuth();
  const { getWhatsAppUrl } = useSettings();

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="brand-logo-badge">
                <IconSparkles size={18} />
              </div>
              <span className="brand-title">NEX<span className="brand-highlight">CATALOG</span></span>
            </div>
            <p className="footer-tagline">
              La plataforma de catálogo digital diseñada para conectar clientes con los mejores productos disponibles de manera rápida, confiable y moderna.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#catalogo">Catálogo Completo</a></li>
              <li><a href="#destacados">Nuevos Ingresos</a></li>
              <li><a href="#ofertas">Promociones</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Atención al Cliente</h4>
            <ul>
              <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer">Asesoría por WhatsApp</a></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
              <li><a href="#envios">Envíos y Entregas</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contacto Rápido</h4>
            <p className="footer-contact-text">¿Tienes dudas sobre algún artículo o deseas hacer un pedido especial?</p>
            <a
              href={getWhatsAppUrl('¡Hola! Deseo más información sobre los productos del catálogo.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <IconWhatsApp size={18} />
              <span>Chatear con un Asesor</span>
            </a>
          </div>
        </div>

        {/* Admin portal access bar in footer */}
        <div className="footer-admin-bar">
          {!isAdmin ? (
            <button
              className="footer-admin-link"
              onClick={() => openAuthModal('login')}
            >
              <IconShield size={16} />
              <span>¿Eres admin o registrar un nuevo admin?</span>
            </button>
          ) : (
            <span className="footer-admin-status">
              <IconShield size={16} />
              <span>Sesión activa como Administrador</span>
            </span>
          )}
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NexCatalog. Todos los derechos reservados.</p>
          <div className="footer-bottom-right">
            <p className="footer-built">Desarrollado con React 19 & Express REST API</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
