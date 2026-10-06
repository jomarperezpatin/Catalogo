import React, { useState } from 'react';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconClose,
  IconSparkles,
  IconPackage,
  IconShield,
  IconAlert,
  IconCheck,
} from '../common/Icons';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../service/api';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';
import { IconWhatsApp } from '../common/Icons';

export const AdminDashboard = ({
  products,
  onOpenCreate,
  onOpenEdit,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { success, error } = useToast();

  const { whatsappNumber, updateWhatsAppNumber, getWhatsAppUrl } = useSettings();
  const [localWhatsApp, setLocalWhatsApp] = useState(whatsappNumber || '');

  const handleSaveWhatsApp = async (e) => {
    e.preventDefault();
    const result = await updateWhatsAppNumber(localWhatsApp.trim());
    if (result?.success) {
      success('Número de WhatsApp guardado en el servidor. Todos los clientes lo verán.', 'Configuración guardada');
    } else {
      error('No se pudo guardar en el servidor, se guardó localmente como respaldo.', 'Advertencia');
    }
  };

  const handleTestWhatsApp = () => {
    const testUrl = getWhatsAppUrl('¡Hola! Este es un mensaje de prueba desde el Panel de Administración.');
    window.location.href = testUrl;
  };

  const filtered = products.filter((p) => {
    const text = `${p.name} ${p.description || ''} ${p.category?.name || p.category || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await productService.delete(deleteCandidate._id);
      success(`Producto "${deleteCandidate.name}" eliminado correctamente.`, 'Eliminado');
      setDeleteCandidate(null);
      onRefresh();
    } catch (err) {
      error(err.message || 'Error al eliminar producto', 'Error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    try {
      await productService.seedDemoProducts();
      success('Se han cargado los productos de muestra al catálogo.', 'Catálogo poblado');
      onRefresh();
    } catch (err) {
      error('No se pudieron crear los productos demo: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Metrics Banner */}
      <div className="admin-header-row">
        <div>
          <h2>Panel de Gestión de Inventario</h2>
          <p>Administra los productos, precios y configuración de contacto en tiempo real.</p>
        </div>

        <div className="admin-top-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleSeedProducts}
            disabled={isSeeding}
            title="Cargar catálogo con 8 productos de alta resolución"
          >
            <IconSparkles size={16} />
            <span>{isSeeding ? 'Poblando...' : 'Cargar Muestra Demo'}</span>
          </button>

          <button className="btn btn-primary btn-glow" onClick={onOpenCreate}>
            <IconPlus size={18} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-blue">
            <IconPackage size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Productos</span>
            <span className="stat-value">{products.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-green">
            <IconShield size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Valor del Catálogo</span>
            <span className="stat-value">{formatPrice(totalValue)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-purple">
            <IconSparkles size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Precio Promedio</span>
            <span className="stat-value">{formatPrice(avgPrice)}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Configuration Box */}
      <div className="admin-config-card">
        <div className="config-card-header">
          <div className="config-icon-badge">
            <IconWhatsApp size={24} />
          </div>
          <div>
            <h3>Configuración de WhatsApp de Pedidos y Consultas</h3>
            <p>Define el número o enlace directo a donde los clientes enviarán sus pedidos y dudas.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWhatsApp} className="whatsapp-config-form">
          <div className="form-group flex-1">
            <label>Número de WhatsApp o Enlace wa.link / wa.me</label>
            <div className="whatsapp-input-wrap">
              <input
                type="text"
                className="form-control"
                placeholder="Ej. +52 999 123 4567 o https://wa.me/529991234567 o wa.link/tucuenta"
                value={localWhatsApp}
                onChange={(e) => setLocalWhatsApp(e.target.value)}
              />
            </div>
            <span className="form-hint">
              💡 Puedes ingresar solo los dígitos con código de país (ej. <code>529991234567</code>) o el enlace completo.
            </span>
          </div>

          <div className="whatsapp-actions-row">
            <button
              type="submit"
              className="btn btn-primary btn-glow"
            >
              <IconCheck size={18} />
              <span>Guardar WhatsApp</span>
            </button>

            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={handleTestWhatsApp}
              title="Abrir un chat de prueba en WhatsApp"
            >
              <IconWhatsApp size={18} />
              <span>Probar Enlace</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search & Filter Bar */}
      <div className="admin-table-controls">
        <div className="search-input-wrapper flex-1">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filtrar productos en la tabla por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              <IconClose size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Fecha de Creación</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-row">
                  <div className="empty-table-state">
                    <IconPackage size={36} />
                    <p>No se encontraron productos registrados.</p>
                    <button className="btn btn-primary btn-sm mt-3" onClick={onOpenCreate}>
                      <IconPlus size={16} />
                      <span>Crear el primer producto</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const img = item.imagesUrl?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                const createdDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-MX') : '-';

                return (
                  <tr key={item._id}>
                    <td className="cell-thumbnail">
                      <img
                        src={img}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                    </td>
                    <td className="cell-name">
                      <div className="table-product-title">{item.name}</div>
                      <div className="table-product-desc">{item.description}</div>
                    </td>
                    <td className="cell-category">
                      <span className="badge-tag">
                        {item.category?.name || item.category || 'General'}
                      </span>
                    </td>
                    <td className="cell-price font-semibold">
                      {formatPrice(item.price)}
                    </td>
                    <td className="cell-date text-muted">
                      {createdDate}
                    </td>
                    <td className="cell-actions text-right">
                      <button
                        className="btn-icon-round btn-edit"
                        onClick={() => onOpenEdit(item)}
                        title="Editar"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="btn-icon-round btn-delete"
                        onClick={() => setDeleteCandidate(item)}
                        title="Eliminar"
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setDeleteCandidate(null)}>
          <div className="modal-dialog modal-confirm animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-badge">
              <IconAlert size={28} />
            </div>
            <h3>¿Eliminar este producto?</h3>
            <p>
              Estás a punto de eliminar <strong>"{deleteCandidate.name}"</strong>. Esta acción no se puede deshacer y se borrará del catálogo.
            </p>

            <div className="confirm-actions-row">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger btn-glow"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                <IconTrash size={16} />
                <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
