import { create } from 'zustand';
import api from '../utils/api';

const useStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Toasts list
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },

  login: async (email, password, role) => {
    try {
      const res = await api.post('/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    if (!localStorage.getItem('token')) {
      set({ loading: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  }
}));

export default useStore;
