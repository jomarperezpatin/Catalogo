import React from 'react';
import { IconSparkles, IconPackage, IconArrowRight, IconShield } from '../common/Icons';

export const HeroBanner = ({ productCount, onExploreClick, onSeedDemo, isAdmin }) => {
  return (
    <section className="hero-section">
      <div className="hero-glow-blob hero-glow-1"></div>
      <div className="hero-glow-blob hero-glow-2"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <IconSparkles size={16} />
          <span>Colección & Tendencias 2026</span>
        </div>

        <h1 className="hero-title">
          Descubre Productos Que <br />
          <span className="hero-gradient-text">Elevan Tu Estilo de Vida</span>
        </h1>

        <p className="hero-description">
          Explora nuestra selecta variedad de tecnología de vanguardia, moda, accesorios y artículos exclusivos. 
          Calidad certificada, envíos inmediatos y atención personalizada en cada compra.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg btn-glow" onClick={onExploreClick}>
            <span>Ver Catálogo Completo</span>
            <IconArrowRight size={18} />
          </button>

          {isAdmin && productCount === 0 && (
            <button className="btn btn-secondary btn-lg" onClick={onSeedDemo}>
              <IconSparkles size={18} />
              <span>Cargar Productos Demo</span>
            </button>
          )}
        </div>

        {/* Feature stats cards */}
        <div className="hero-features-grid">
          <div className="hero-feature-item">
            <div className="feature-icon-box">
              <IconPackage size={22} />
            </div>
            <div>
              <h4>{productCount > 0 ? `${productCount}+ Artículos` : 'Gran Variedad'}</h4>
              <p>Actualización en tiempo real</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-box">
              <IconShield size={22} />
            </div>
            <div>
              <h4>Garantía y Confianza</h4>
              <p>Productos 100% verificados</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-box">
              <IconSparkles size={22} />
            </div>
            <div>
              <h4>Atención Directa</h4>
              <p>Pedidos rápidos vía WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
