import api from './api';

/**
 * Auth service — matches NestJS AuthController + ApiResponseInterceptor
 * 
 * Login response shape from backend:
 * { success: true, data: { user: { id, name, email }, accessToken, refreshToken }, timestamp }
 */
export const authService = {
  async login(email, password) {
    const { data: envelope } = await api.post('/auth/login', { email, password });
    const payload = envelope.data; // { user, accessToken, refreshToken }

    localStorage.setItem('access_token', payload.accessToken);
    localStorage.setItem('refresh_token', payload.refreshToken);
    localStorage.setItem('user', JSON.stringify(payload.user));

    return payload;
  },

  async signup(name, email, password) {
    const { data: envelope } = await api.post('/auth/signup', { name, email, password });
    const payload = envelope.data; // { user, accessToken, refreshToken }

    localStorage.setItem('access_token', payload.accessToken);
    localStorage.setItem('refresh_token', payload.refreshToken);
    localStorage.setItem('user', JSON.stringify(payload.user));

    return payload;
  },

  async loginWithGoogle(token) {
    const { data: envelope } = await api.post('/auth/google', { token });
    const payload = envelope.data;

    localStorage.setItem('access_token', payload.accessToken);
    localStorage.setItem('refresh_token', payload.refreshToken);
    localStorage.setItem('user', JSON.stringify(payload.user));

    return payload;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.clear();
    }
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
