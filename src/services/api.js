import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Erro do servidor
      throw new Error(`Erro ${error.response.status}: ${error.response.data.message || 'Erro no servidor'}`);
    } else if (error.request) {
      // Erro de conexão
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Erro na configuração
      throw new Error('Erro na requisição');
    }
  }
);

export const productApi = {
  // Categorias masculinas
  getMensProducts: () => Promise.all([
    api.get('/products/category/mens-shirts'),
    api.get('/products/category/mens-shoes'),
    api.get('/products/category/mens-watches'),
  ]),

  // Categorias femininas
  getWomensProducts: () => Promise.all([
    api.get('/products/category/womens-bags'),
    api.get('/products/category/womens-dresses'),
    api.get('/products/category/womens-jewellery'),
    api.get('/products/category/womens-shoes'),
    api.get('/products/category/womens-watches'),
  ]),

  // Produto específico
  getProductById: (id) => api.get(`/products/${id}`),

  // Buscar por categoria individual
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
};

export default api;