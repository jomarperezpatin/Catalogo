import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/layout/HeroBanner';
import { Footer } from './components/layout/Footer';
import { FilterBar } from './components/catalog/FilterBar';
import { ProductCard } from './components/catalog/ProductCard';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/admin/AuthModal';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  IconPackage,
  IconRefresh,
  IconSparkles,
  IconAlert,
  IconHeart,
} from './components/common/Icons';
import { productService } from './service/api';

function CatalogApp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'admin'

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [formModal, setFormModal] = useState({ isOpen: false, product: null });

  const { isAdmin, openAuthModal } = useAuth();
  const { wishlist, isWishlistOnly, setIsWishlistOnly } = useCart();
  const { success, error } = useToast();

  // Listen for secret keyboard shortcut (Ctrl + Shift + A) or URL hash (#admin)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAuthModal('login');
      }
    };

    const checkHashOrQuery = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        openAuthModal('login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHashOrQuery);
    checkHashOrQuery();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashOrQuery);
    };
  }, [openAuthModal]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await productService.getAll();
      const items = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
      setProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
      setFetchError(err.message || 'No se pudo conectar con el servidor de la API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const cat = typeof p.category === 'string' ? p.category : p.category?.name;
      if (cat && cat.trim()) {
        set.add(cat.trim());
      }
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Wishlist only filter
    if (isWishlistOnly) {
      list = list.filter((p) => wishlist.some((w) => (w._id || w) === p._id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        const cat = typeof p.category === 'string' ? p.category : p.category?.name;
        return cat === selectedCategory;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = (typeof p.category === 'string' ? p.category : p.category?.name)?.toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      // newest default
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return list;
  }, [products, isWishlistOnly, wishlist, selectedCategory, searchQuery, sortBy]);

  const handleOpenCreate = () => {
    setFormModal({ isOpen: true, product: null });
  };

  const handleOpenEdit = (product) => {
    setFormModal({ isOpen: true, product });
  };

  const handleSeedDemoData = async () => {
    try {
      setLoading(true);
      await productService.seedDemoProducts();
      success('Catálogo poblado con productos de demostración', 'Listo');
      await loadProducts();
    } catch (err) {
      error(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        onOpenNewProduct={handleOpenCreate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {activeTab === 'admin' && isAdmin ? (
          <div className="content-container section-pad">
            <AdminDashboard
              products={products}
              onOpenCreate={handleOpenCreate}
              onOpenEdit={handleOpenEdit}
              onRefresh={loadProducts}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {!isWishlistOnly && (
              <HeroBanner
                productCount={products.length}
                onExploreClick={scrollToCatalog}
                onSeedDemo={handleSeedDemoData}
                isAdmin={isAdmin}
              />
            )}

            <div className="content-container section-pad">
              {isWishlistOnly && (
                <div className="wishlist-header-banner animate-fade-in">
                  <div className="wishlist-badge">
                    <IconHeart size={20} filled={true} className="text-danger" />
                  </div>
                  <div>
                    <h2>Tus Artículos Favoritos</h2>
                    <p>Accede rápidamente a los productos que has guardado.</p>
                  </div>
                </div>
              )}

              {/* Filter and search controls */}
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                totalResults={filteredProducts.length}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
              />

              {/* State handling: Loading skeletons, Error or Grid */}
              {loading ? (
                <div className="product-grid skeleton-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="product-card skeleton-card">
                      <div className="skeleton skeleton-img"></div>
                      <div className="skeleton skeleton-tag"></div>
                      <div className="skeleton skeleton-title"></div>
                      <div className="skeleton skeleton-text"></div>
                      <div className="skeleton skeleton-footer"></div>
                    </div>
                  ))}
                </div>
              ) : fetchError ? (
                <div className="state-card error-card animate-fade-in">
                  <div className="state-icon-wrap icon-error">
                    <IconAlert size={36} />
                  </div>
                  <h3>No pudimos cargar los productos</h3>
                  <p>{fetchError}</p>
                  <p className="state-hint">Asegúrate de que la API en el backend esté ejecutándose en el puerto 4000.</p>
                  <button className="btn btn-primary btn-glow" onClick={loadProducts}>
                    <IconRefresh size={18} />
                    <span>Reintentar Conexión</span>
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="state-card empty-card animate-fade-in">
                  <div className="state-icon-wrap">
                    <IconPackage size={40} />
                  </div>
                  {isWishlistOnly ? (
                    <>
                      <h3>No tienes favoritos guardados</h3>
                      <p>Haz clic en el icono del corazón en cualquier producto del catálogo para añadirlo aquí.</p>
                      <button className="btn btn-primary btn-glow" onClick={() => setIsWishlistOnly(false)}>
                        <span>Explorar Catálogo</span>
                      </button>
                    </>
                  ) : searchQuery || selectedCategory !== 'all' ? (
                    <>
                      <h3>No se encontraron resultados</h3>
                      <p>Intenta cambiar los términos de búsqueda o selecciona otra categoría.</p>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                      >
                        Restablecer Filtros
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>El catálogo está vacío</h3>
                      <p>Aún no hay artículos publicados en la base de datos.</p>
                      {isAdmin ? (
                        <div className="empty-actions-row">
                          <button className="btn btn-primary btn-glow" onClick={handleOpenCreate}>
                            <span>Crear Primer Producto</span>
                          </button>
                          <button className="btn btn-secondary" onClick={handleSeedDemoData}>
                            <IconSparkles size={16} />
                            <span>Cargar Productos de Prueba</span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-muted">Inicia sesión como administrador para añadir productos.</p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                      onEdit={handleOpenEdit}
                      onDelete={(p) => {
                        setActiveTab('admin');
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal (Login / Register Admin) */}
      <AuthModal />

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Create / Edit Product Modal */}
      <ProductFormModal
        product={formModal.product}
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, product: null })}
        onSaveSuccess={() => {
          loadProducts();
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <CatalogApp />
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
