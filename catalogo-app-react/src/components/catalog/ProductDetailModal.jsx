import React, { useState } from 'react';
import {
  IconClose,
  IconCart,
  IconHeart,
  IconPlus,
  IconMinus,
  IconWhatsApp,
  IconPackage,
  IconShield,
  IconSparkles,
} from '../common/Icons';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { getWhatsAppUrl } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const images = Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0
    ? product.imagesUrl
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'];

  const isFavorited = isInWishlist(product._id);

  const handleWhatsAppInquiry = () => {
    const mainImg = images[0] || '';
    let text = `¡Hola! Me interesa obtener más información sobre el siguiente producto de su catálogo:\n\n`;
    text += `📌 *Producto:* ${product.name}\n`;
    text += `💰 *Precio:* ${formatPrice(product.price)} MXN\n`;
    text += `🔢 *Cantidad deseada:* ${quantity} pieza(s)\n`;
    if (mainImg) {
      text += `🖼️ *Foto:* ${mainImg}\n`;
    }
    text += `\n¿Tienen disponibilidad para entrega inmediata? ¡Gracias!`;

    const targetUrl = getWhatsAppUrl(text);
    window.location.href = targetUrl;
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-dialog modal-product-detail animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <IconClose size={20} />
        </button>

        <div className="product-detail-layout">
          {/* Left Column: Gallery */}
          <div className="product-gallery-section">
            <div className="main-image-display">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="thumbnail-gallery-row">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${product.name} miniatura ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="product-detail-info">
            <div className="detail-header-row">
              <div className="product-category-tag">
                <IconPackage size={14} />
                <span>{product.category?.name || product.category || 'Catálogo General'}</span>
              </div>
              <button
                className={`btn-icon-round wishlist-action-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={() => toggleWishlist(product)}
                title="Guardar en favoritos"
              >
                <IconHeart size={18} filled={isFavorited} />
              </button>
            </div>

            <h2 className="detail-title">{product.name}</h2>

            <div className="detail-price-box">
              <span className="detail-price">{formatPrice(product.price)}</span>
              <span className="price-tax-label">+ IVA si requiere factura</span>
            </div>

            <div className="detail-description-box">
              <h4>Descripción del producto</h4>
              <p>{product.description}</p>
            </div>

            <div className="detail-features-list">
              <div className="feature-pill">
                <IconShield size={16} />
                <span>Garantía de Satisfacción</span>
              </div>
              <div className="feature-pill">
                <IconSparkles size={16} />
                <span>Artículo 100% Original</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="detail-quantity-control">
              <span className="qty-label">Cantidad:</span>
              <div className="qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <IconMinus size={14} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <IconPlus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions-group">
              <button
                className="btn btn-primary btn-lg btn-glow flex-1"
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
              >
                <IconCart size={20} />
                <span>Agregar {quantity > 1 ? `(${quantity})` : ''} al Carrito</span>
              </button>

              <button
                className="btn btn-whatsapp btn-lg"
                onClick={handleWhatsAppInquiry}
                title="Consultar disponibilidad por WhatsApp"
              >
                <IconWhatsApp size={20} />
                <span>Preguntar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
