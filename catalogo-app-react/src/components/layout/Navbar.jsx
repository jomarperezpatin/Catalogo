import React, { useState } from 'react';
import {
  IconCart,
  IconHeart,
  IconUser,
  IconShield,
  IconLogOut,
  IconPlus,
  IconSparkles,
  IconPackage,
} from '../common/Icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = ({
  onOpenNewProduct,
  activeTab,
  setActiveTab,
}) => {
  const { admin, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, wishlistCount, setIsCartOpen, isWishlistOnly, setIsWishlistOnly } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => { setActiveTab('catalog'); setIsWishlistOnly(false); }}>
          <div className="brand-logo-badge">
            <IconSparkles size={22} className="text-primary-glow" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">NEX<span className="brand-highlight">CATALOG</span></span>
            <span className="brand-subtitle">Catálogo Digital Exclusivo</span>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="navbar-nav">
          <button
            className={`nav-link ${activeTab === 'catalog' && !isWishlistOnly ? 'active' : ''}`}
            onClick={() => { setActiveTab('catalog'); setIsWishlistOnly(false); }}
          >
            <IconPackage size={17} />
            <span>Catálogo</span>
          </button>

          <button
            className={`nav-link ${isWishlistOnly ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('catalog');
              setIsWishlistOnly(!isWishlistOnly);
            }}
          >
            <IconHeart size={17} filled={isWishlistOnly} />
            <span>Favoritos</span>
            {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
          </button>

          {isAdmin && (
            <button
              className={`nav-link admin-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('admin'); setIsWishlistOnly(false); }}
            >
              <IconShield size={17} />
              <span>Panel Admin</span>
              <span className="admin-status-dot"></span>
            </button>
          )}
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          {isAdmin && (
            <button
              className="btn btn-primary btn-sm btn-glow"
              onClick={onOpenNewProduct}
              title="Crear nuevo producto en el catálogo"
            >
              <IconPlus size={16} />
              <span className="hide-mobile">Nuevo Producto</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            className="navbar-icon-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Ver carrito"
          >
            <IconCart size={22} />
            {cartCount > 0 && (
              <span className="cart-badge-counter animate-pop">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User menu for logged-in Admin */}
          {isAdmin && (
            <div className="user-menu-wrapper">
              <div className="user-dropdown-container">
                <button
                  className="user-avatar-btn active"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  title={`Conectado como ${admin?.name || 'Admin'}`}
                >
                  <div className="avatar-circle">
                    {(admin?.name || 'A')[0].toUpperCase()}
                  </div>
                  <span className="user-name-label hide-mobile">{admin?.name || 'Admin'}</span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu animate-fade-down" onMouseLeave={() => setUserDropdownOpen(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{admin?.name}</p>
                      <p className="dropdown-email">{admin?.email}</p>
                      <span className="badge-admin">Administrador</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setActiveTab('admin');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <IconShield size={16} />
                      <span>Gestión de Inventario</span>
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                    >
                      <IconLogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
