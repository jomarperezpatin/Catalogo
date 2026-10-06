// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic request wrapper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options.auth !== false),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.errors?.[0]?.msg || data?.error || 'Error en la petición';
      const error = new Error(errorMessage);
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const authService = {
  async login(email, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  },

  async register(name, email, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      auth: false,
    });
  },

  async getMe() {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};

export const productService = {
  async getAll() {
    return apiRequest('/products', {
      method: 'GET',
      auth: false,
    });
  },

  async getById(id) {
    return apiRequest(`/products/${id}`, {
      method: 'GET',
      auth: false,
    });
  },

  async getByCategory(category) {
    return apiRequest(`/products/category/${encodeURIComponent(category)}`, {
      method: 'GET',
      auth: false,
    });
  },

  async create(productData) {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      auth: true,
    });
  },

  async update(id, productData) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      auth: true,
    });
  },

  async delete(id) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  // Demo initial products for quick testing and onboarding (in MXN)
  async seedDemoProducts() {
    const demoItems = [
      {
        name: "Auriculares Inalámbricos Pro X Noise-Cancelling",
        description: "Auriculares de alta fidelidad con cancelación activa de ruido, 40 horas de batería y sonido envolvente espacial 3D.",
        price: 1899.00,
        category: "Tecnología",
        imagesUrl: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Smartwatch Ultra OLED Titanium Series",
        description: "Reloj inteligente con caja de titanio resistente al agua, GPS de doble frecuencia, monitor de salud cardíaca y 7 días de autonomía.",
        price: 3499.00,
        category: "Tecnología",
        imagesUrl: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Cámara Mirrorless 4K Creator Edition",
        description: "Sensor Full Frame de 33MP, grabación de video en 4K 60fps sin recorte y estabilización de imagen en 5 ejes.",
        price: 18999.00,
        category: "Fotografía",
        imagesUrl: [
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Mochila Ergonómica Impermeable UrbanTech",
        description: "Diseño antirrobo con puerto USB de carga rápida, compartimento acolchado para laptop de 16 pulgadas y tela balística repelente al agua.",
        price: 899.00,
        category: "Accesorios",
        imagesUrl: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Zapatillas Deportivas Quantum Air Flow",
        description: "Amortiguación reactiva con espuma nitrogenada ultraligera y malla transpirable para máximo rendimiento y confort diario.",
        price: 1699.00,
        category: "Calzado",
        imagesUrl: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Lámpara Minimalista Nórdica Smart RGB",
        description: "Iluminación ambiental inteligente con control por app y voz, 16 millones de colores y brillo regulable con base de madera maciza.",
        price: 749.00,
        category: "Hogar",
        imagesUrl: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Teclado Mecánico Custom RGB Hot-Swappable",
        description: "Switches lubricados de fábrica, estructura gasket mount insonorizada, conectividad triple (Bluetooth, 2.4GHz, Tipo-C) y teclas PBT.",
        price: 1499.00,
        category: "Tecnología",
        imagesUrl: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        name: "Gafas de Sol Polarizadas Aviador Titanium",
        description: "Montura ultraligera de aleación premium, protección UV400 completa y cristales antireflectantes de alta definición.",
        price: 1199.00,
        category: "Accesorios",
        imagesUrl: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
        ]
      }
    ];

    const results = [];
    for (const item of demoItems) {
      try {
        const created = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(item),
          auth: true,
        });
        results.push(created);
      } catch (err) {
        console.warn('Could not seed product:', item.name, err);
      }
    }
    return results;
  }
};

export const settingsService = {
  // Public — any visitor can read the admin's WhatsApp number
  async getWhatsApp() {
    return apiRequest('/settings/whatsapp', {
      method: 'GET',
      auth: false,
    });
  },

  // Protected — only admins can update
  async updateWhatsApp(whatsappNumber) {
    return apiRequest('/settings/whatsapp', {
      method: 'PUT',
      body: JSON.stringify({ whatsappNumber }),
      auth: true,
    });
  },
};
