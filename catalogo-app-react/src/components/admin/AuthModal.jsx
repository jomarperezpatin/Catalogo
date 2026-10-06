import React, { useState, useEffect } from 'react';
import {
  IconClose,
  IconShield,
  IconCheck,
  IconAlert,
  IconArrowRight,
  IconChevronLeft,
} from '../common/Icons';
import { useAuth } from '../../context/AuthContext';

const MASTER_KEY = 'negro2405';

export const AuthModal = () => {
  const { authModalOpen, authMode, setAuthMode, closeAuthModal, login, register } = useAuth();

  // 'gate' (clave secreta) | 'auth' (login / register)
  const [step, setStep] = useState('gate');
  const [enteredKey, setEnteredKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Reset states when modal is opened
  useEffect(() => {
    if (authModalOpen) {
      setStep('gate');
      setEnteredKey('');
      setKeyError('');
      setAuthError('');
      setFormData({ name: '', email: '', password: '' });
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  // Handle master security key verification
  const handleVerifyKey = (e) => {
    e.preventDefault();
    setKeyError('');

    if (enteredKey.trim() === MASTER_KEY) {
      setStep('auth');
    } else {
      setKeyError('Clave de acceso incorrecta. Verifica e intenta nuevamente.');
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setAuthError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          throw new Error('El nombre es obligatorio para registrarse');
        }
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setAuthError(err.message || 'Ocurrió un error durante la autenticación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={closeAuthModal}>
      <div
        className="modal-dialog modal-auth animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Cerrar modal">
          <IconClose size={20} />
        </button>

        {/* STEP 1: GATE WITH MASTER KEY */}
        {step === 'gate' ? (
          <div className="gate-step-content animate-fade-in">
            <div className="auth-header">
              <div className="auth-icon-badge badge-security">
                <IconShield size={32} />
              </div>
              <h3>Acceso Administrativo</h3>
              <p>
                Para continuar e iniciar sesión o registrar un nuevo administrador, ingresa la clave de autorización.
              </p>
            </div>

            {keyError && (
              <div className="auth-error-alert animate-fade-in">
                <IconAlert size={16} />
                <span>{keyError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyKey} className="auth-form">
              <div className="form-group">
                <label>Clave de Autorización</label>
                <input
                  type="password"
                  required
                  autoFocus
                  className="form-control text-center"
                  placeholder="••••••••"
                  value={enteredKey}
                  onChange={(e) => {
                    setEnteredKey(e.target.value);
                    setKeyError('');
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg btn-glow"
              >
                <span>Validar Clave</span>
                <IconArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: LOGIN / REGISTER FORMS */
          <div className="auth-step-content animate-fade-in">
            <div className="auth-back-row">
              <button
                className="btn-link btn-link-sm"
                onClick={() => setStep('gate')}
              >
                <IconChevronLeft size={16} />
                <span>Volver al paso anterior</span>
              </button>
            </div>

            <div className="auth-header">
              <div className="auth-icon-badge">
                <IconShield size={28} />
              </div>
              <h3>{authMode === 'login' ? 'Iniciar Sesión como Admin' : 'Registrar Nuevo Administrador'}</h3>
              <p>
                {authMode === 'login'
                  ? 'Ingresa tus credenciales para gestionar el catálogo e inventario.'
                  : 'Completa los campos para dar de alta un nuevo administrador con acceso total.'}
              </p>
            </div>

            {/* Tab switcher: Login / Register */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
              >
                Registrar Nuevo Admin
              </button>
            </div>

            {authError && (
              <div className="auth-error-alert animate-fade-in">
                <IconAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control"
                    placeholder="Ej. Carlos Rodríguez"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-control"
                  placeholder="admin@ejemplo.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg btn-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Procesando...</span>
                ) : authMode === 'login' ? (
                  <span>Ingresar al Panel</span>
                ) : (
                  <span>Crear Cuenta Administrador</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
