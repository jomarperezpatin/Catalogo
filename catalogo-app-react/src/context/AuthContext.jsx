import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../service/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const { success, error } = useToast();

  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('admin_token');
    if (!savedToken) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response && response.data) {
        setAdmin(response.data);
      } else {
        localStorage.removeItem('admin_token');
        setToken(null);
        setAdmin(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('admin_token');
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.token) {
        localStorage.setItem('admin_token', response.token);
        setToken(response.token);
        setAdmin(response.admin);
        setAuthModalOpen(false);
        success(`¡Bienvenido/a de nuevo, ${response.admin.name || 'Admin'}!`, 'Sesión iniciada');
        return true;
      }
      return false;
    } catch (err) {
      error(err.message || 'Credenciales inválidas', 'Error de acceso');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      if (response.success && response.token) {
        localStorage.setItem('admin_token', response.token);
        setToken(response.token);
        setAdmin(response.admin);
        setAuthModalOpen(false);
        success(`Cuenta creada con éxito. ¡Bienvenido/a, ${response.admin.name}!`, 'Registro exitoso');
        return true;
      }
      return false;
    } catch (err) {
      error(err.message || 'Error al registrar administrador', 'Error de registro');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
    success('Has cerrado sesión correctamente.', 'Sesión cerrada');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    admin,
    token,
    isAdmin: !!admin,
    loading,
    authModalOpen,
    authMode,
    setAuthMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
