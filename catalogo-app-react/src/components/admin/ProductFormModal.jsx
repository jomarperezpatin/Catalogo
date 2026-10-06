import React, { useState, useEffect } from 'react';
import {
  IconClose,
  IconPlus,
  IconTrash,
  IconCheck,
  IconPackage,
  IconSparkles,
} from '../common/Icons';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../service/api';

export const ProductFormModal = ({ product, isOpen, onClose, onSaveSuccess }) => {
  const isEdit = !!product;
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imagesUrl: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category: typeof product.category === 'string' ? product.category : product.category?.name || '',
        imagesUrl: Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0 ? product.imagesUrl : [''],
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        imagesUrl: [''],
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.imagesUrl];
      updated[index] = value;
      return { ...prev, imagesUrl: updated };
    });
  };

  const handleAddImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ''],
    }));
  };

  const handleRemoveImageUrl = (index) => {
    setFormData((prev) => {
      const updated = prev.imagesUrl.filter((_, i) => i !== index);
      return { ...prev, imagesUrl: updated.length > 0 ? updated : [''] };
    });
  };

  const handleSetExampleImage = (url) => {
    setFormData((prev) => {
      const filtered = prev.imagesUrl.filter((u) => u.trim() !== '');
      return { ...prev, imagesUrl: [...filtered, url] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      error('Ingresa un precio válido mayor o igual a 0');
      return;
    }

    if (!formData.description.trim()) {
      error('La descripción del producto es obligatoria');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanedImages = formData.imagesUrl
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imagesUrl: cleanedImages.length > 0 ? cleanedImages : [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
        ],
      };

      if (formData.category.trim()) {
        // If your schema expects string category
        payload.category = formData.category.trim();
      }

      let response;
      if (isEdit) {
        response = await productService.update(product._id, payload);
        success(`Producto "${formData.name}" actualizado con éxito.`, 'Actualizado');
      } else {
        response = await productService.create(payload);
        success(`Producto "${formData.name}" agregado al catálogo.`, 'Creado');
      }

      onSaveSuccess(response.data || response);
      onClose();
    } catch (err) {
      error(err.message || 'Error al guardar el producto', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-dialog modal-product-form animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <IconClose size={20} />
        </button>

        <div className="product-form-header">
          <div className="form-header-badge">
            <IconPackage size={22} />
          </div>
          <div>
            <h3>{isEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
            <p>{isEdit ? 'Modifica los datos del artículo seleccionado' : 'Ingresa la información para publicarlo en la tienda'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-form-body">
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                placeholder="Ej. Auriculares Bluetooth Inalámbricos"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group flex-1">
              <label>Precio ($ MXN) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                className="form-control"
                placeholder="Ej. 499.00"
                value={formData.price}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría / Etiqueta</label>
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Ej. Tecnología, Ropa, Hogar, Calzado..."
              value={formData.category}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Descripción Completa *</label>
            <textarea
              name="description"
              required
              rows={3}
              className="form-control"
              placeholder="Describe las especificaciones, características y beneficios clave del producto..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Image URLs input section */}
          <div className="form-group">
            <div className="images-header-row">
              <label>Imágenes (URLs directas)</label>
              <button
                type="button"
                className="btn-link btn-link-sm"
                onClick={handleAddImageUrl}
              >
                <IconPlus size={14} />
                <span>Agregar otra imagen</span>
              </button>
            </div>

            <div className="image-urls-list">
              {formData.imagesUrl.map((url, idx) => (
                <div key={idx} className="image-url-input-item">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    disabled={isSubmitting}
                  />
                  {formData.imagesUrl.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon-round btn-danger-icon"
                      onClick={() => handleRemoveImageUrl(idx)}
                      title="Eliminar URL"
                    >
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Live previews */}
            {formData.imagesUrl.some((u) => u.trim() !== '') && (
              <div className="images-live-preview-grid">
                {formData.imagesUrl
                  .filter((u) => u.trim() !== '')
                  .map((url, i) => (
                    <div key={i} className="preview-thumb">
                      <img
                        src={url}
                        alt="Previsualización"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* Quick Unsplash Suggestion buttons */}
            <div className="image-suggestions">
              <span className="suggestions-label">Fotos de muestra rápida:</span>
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => handleSetExampleImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')}
              >
                🎧 Auriculares
              </button>
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => handleSetExampleImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80')}
              >
                ⌚ Reloj
              </button>
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => handleSetExampleImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80')}
              >
                👟 Calzado
              </button>
            </div>
          </div>

          <div className="product-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-glow"
              disabled={isSubmitting}
            >
              <IconCheck size={18} />
              <span>{isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
