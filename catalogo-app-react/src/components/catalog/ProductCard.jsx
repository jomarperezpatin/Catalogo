import React, { useState } from 'react';
import {
  IconHeart,
  IconCart,
  IconEye,
  IconEdit,
  IconTrash,
  IconPackage,
} from '../common/Icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

import { formatPrice } from '../../utils/formatters';

export const ProductCard = ({
  product,
  onQuickView,
  onEdit,
  onDelete,
  viewMode = 'grid',
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAdmin } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0
    ? product.imagesUrl
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'];

  const currentImage = images[activeImageIndex] || images[0];
  const isFavorited = isInWishlist(product._id);

  return (
    <div className={`product-card ${viewMode === 'list' ? 'product-card-list' : ''}`}>
      {/* Image & Badges Container */}
      <div className="product-image-container">
        <img
          src={currentImage}
          alt={product.name}
          className="product-main-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';
          }}
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          className={`btn-icon-floating wishlist-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? "Eliminar de favoritos" : "Guardar en favoritos"}
        >
          <IconHeart size={18} filled={isFavorited} />
        </button>

        {/* Quick View overlay button */}
        <div className="image-overlay-actions">
          <button
            className="btn btn-glass btn-sm"
            onClick={() => onQuickView(product)}
          >
            <IconEye size={16} />
            <span>Vista Rápida</span>
          </button>
        </div>

        {/* Multi-image indicator dots */}
        {images.length > 1 && (
          <div className="card-image-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === activeImageIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveImageIndex(idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="product-info-wrapper">
        <div className="product-category-tag">
          <IconPackage size={13} />
          <span>{product.category?.name || product.category || 'Catálogo General'}</span>
        </div>

        <h3
          className="product-title"
          onClick={() => onQuickView(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-card-footer">
          <div className="product-pricing">
            <span className="price-label">Precio</span>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>

          <div className="card-actions-row">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="admin-inline-actions">
                <button
                  className="btn-icon-round btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  title="Editar producto"
                >
                  <IconEdit size={16} />
                </button>
                <button
                  className="btn-icon-round btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product);
                  }}
                  title="Eliminar producto"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              className="btn btn-primary btn-sm btn-add-cart"
              onClick={() => addToCart(product, 1)}
            >
              <IconCart size={16} />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
