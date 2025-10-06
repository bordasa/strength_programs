import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; full_name: string; role: string }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Programs API
export const programsAPI = {
  create: async (data: any) => {
    const response = await api.post('/api/programs', data);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/api/programs');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/api/programs/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/programs/${id}`);
  },

  update: async (id: string, data: { name?: string; status?: string }) => {
    const response = await api.patch(`/api/programs/${id}`, data);
    return response.data;
  },

  rerollWeek: async (id: string, weekNumber: number, lift?: string) => {
    const params = lift ? { lift } : {};
    const response = await api.post(`/api/programs/${id}/reroll-week/${weekNumber}`, null, { params });
    return response.data;
  },
};

