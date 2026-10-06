import React, { useState } from 'react';
import {
  IconClose,
  IconTrash,
  IconPlus,
  IconMinus,
  IconCart,
  IconWhatsApp,
  IconPackage,
  IconArrowRight,
} from '../common/Icons';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();
  const { success } = useToast();
  const { getWhatsAppUrl, whatsappNumber } = useSettings();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia bancaria');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    // Build a COMPACT message — WhatsApp URLs break (black screen) with long messages
    const name = customerName.trim() || 'No especificado';
    const phone = customerPhone.trim();

    // Short product lines: "2x Producto - $100.00"
    const productLines = cart.map((item) => {
      const sub = (item.product.price || 0) * item.quantity;
      return `${item.quantity}x ${item.product.name} - ${formatPrice(sub)}`;
    });

    // Build minimal message
    let msg = `*NUEVO PEDIDO*\n`;
    msg += `Nombre: ${name}\n`;
    if (phone) msg += `Tel: ${phone}\n`;
    msg += `Pago: ${paymentMethod}\n`;
    if (customerNotes.trim()) msg += `Notas: ${customerNotes.trim()}\n`;
    msg += `\n`;
    msg += productLines.join('\n');
    msg += `\n\n*Total: ${formatPrice(cartTotal)} MXN*`;

    // Build a full detailed message for clipboard (this one can be long)
    let fullMessage = `🛒 *PEDIDO COMPLETO*\n\n`;
    fullMessage += `📋 *Cliente:* ${name}\n`;
    if (phone) fullMessage += `📱 *Tel:* ${phone}\n`;
    fullMessage += `💳 *Pago:* ${paymentMethod}\n`;
    if (customerNotes.trim()) fullMessage += `📝 *Notas:* ${customerNotes.trim()}\n`;
    fullMessage += `\n📦 *Productos:*\n`;
    cart.forEach((item, i) => {
      const sub = (item.product.price || 0) * item.quantity;
      const img = item.product.imagesUrl?.[0] || '';
      fullMessage += `${i + 1}. ${item.product.name}\n`;
      fullMessage += `   Cant: ${item.quantity} | ${formatPrice(sub)}\n`;
      if (img) fullMessage += `   Foto: ${img}\n`;
    });
    fullMessage += `\n💰 *TOTAL: ${formatPrice(cartTotal)} MXN*`;

    // Copy detailed version to clipboard as backup
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullMessage).catch(() => {});
    }

    // Use wa.me with the SHORT message to avoid black screen
    const raw = (whatsappNumber || '').trim();
    const cleanNumber = raw.replace(/[^0-9]/g, '');
    // Prepend Mexico code if 10 digits
    const phoneNum = cleanNumber.length === 10 ? '52' + cleanNumber : cleanNumber;
    const encoded = encodeURIComponent(msg);
    
    let url;
    if (phoneNum) {
      url = `https://wa.me/${phoneNum}?text=${encoded}`;
    } else {
      url = `https://wa.me/?text=${encoded}`;
    }

    // Use location.href — window.open causes black screen in many browsers
    window.location.href = url;

    if (!whatsappNumber) {
      success('Abriendo WhatsApp... (Configura tu número en el Panel Admin)', 'Pedido preparado');
    } else {
      success('¡Pedido enviado! El detalle completo fue copiado al portapapeles.', 'Pedido enviado');
    }

    clearCart();
    setIsCartOpen(false);
    setIsCheckoutStep(false);
  };



  return (
    <div className="cart-drawer-backdrop animate-fade-in" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel animate-slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <IconCart size={22} className="text-primary" />
            <h3>Tu Carrito de Compras</h3>
            <span className="cart-header-count">({cartCount})</span>
          </div>
          <button
            className="btn-icon-round"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <IconCart size={48} />
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>Explora nuestro catálogo y agrega los productos que más te gusten.</p>
              <button
                className="btn btn-primary btn-glow"
                onClick={() => setIsCartOpen(false)}
              >
                <span>Descubrir Productos</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          ) : isCheckoutStep ? (
            <div className="cart-checkout-form animate-fade-in">
              <div className="checkout-step-header">
                <h4>Datos para el Pedido</h4>
                <button
                  className="btn-link"
                  onClick={() => setIsCheckoutStep(false)}
                >
                  Volver al carrito
                </button>
              </div>

              <div className="form-group">
                <label>Tu Nombre Completo *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Ej. Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Número de WhatsApp / Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Ej. +52 999 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Forma de Pago</label>
                <div className="payment-options-grid">
                  <label className={`payment-option-card ${paymentMethod === 'Transferencia bancaria' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Transferencia bancaria"
                      checked={paymentMethod === 'Transferencia bancaria'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-text">
                      <strong>🏦 Transferencia bancaria</strong>
                      <span>Pago vía SPEI / depósito con comprobante</span>
                    </div>
                  </label>

                  <label className={`payment-option-card ${paymentMethod === 'Pago con tarjeta de crédito' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Pago con tarjeta de crédito"
                      checked={paymentMethod === 'Pago con tarjeta de crédito'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-text">
                      <strong>💳 Pago con tarjeta de crédito</strong>
                      <span>Enlace seguro de cobro con tarjeta</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Notas o Comentarios (Opcional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Alguna indicación o solicitud especial"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>

              <div className="checkout-order-preview">
                <h5>Resumen del Pedido ({cartCount} artículos):</h5>
                <p className="order-preview-total">Total: <strong>{formatPrice(cartTotal)} MXN</strong></p>
                <span className="order-preview-note">Se enviará el detalle completo con fotos y tu forma de pago elegida por WhatsApp.</span>
              </div>

              <div className="checkout-actions">
                <button
                  className="btn btn-whatsapp btn-lg btn-block"
                  onClick={handleWhatsAppCheckout}
                >
                  <IconWhatsApp size={20} />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-items-list">
              <div className="cart-list-actions">
                <span className="items-qty-info">{cart.length} artículos diferentes</span>
                <button className="btn-clear-cart" onClick={clearCart}>
                  <IconTrash size={14} />
                  <span>Vaciar todo</span>
                </button>
              </div>

              {cart.map((item) => {
                const img = item.product.imagesUrl?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80';
                const subtotal = (item.product.price || 0) * item.quantity;

                return (
                  <div key={item.product._id} className="cart-item-card">
                    <img
                      src={img}
                      alt={item.product.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.product.name}</h4>
                      <span className="cart-item-unit-price">{formatPrice(item.product.price)} c/u</span>

                      <div className="cart-item-controls-row">
                        <div className="cart-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            aria-label="Disminuir"
                          >
                            <IconMinus size={13} />
                          </button>
                          <span className="cart-stepper-value">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <IconPlus size={13} />
                          </button>
                        </div>

                        <span className="cart-item-subtotal">{formatPrice(subtotal)}</span>

                        <button
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.product._id)}
                          title="Eliminar producto"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {cart.length > 0 && !isCheckoutStep && (
          <div className="cart-footer">
            <div className="cart-totals-summary">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="totals-row">
                <span>Envío</span>
                <span className="text-success font-semibold">Gratis</span>
              </div>
              <div className="totals-divider"></div>
              <div className="totals-row total-highlight">
                <span>Total Estimado</span>
                <span className="total-amount">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block btn-glow"
              onClick={() => setIsCheckoutStep(true)}
            >
              <span>Proceder al Pedido</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
