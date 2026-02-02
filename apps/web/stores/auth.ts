import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  username: string;
  campus: string;
  name?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setUser: (user) => {
    if (user) {
      try { localStorage.setItem('auth_user', JSON.stringify(user)); } catch {}
    } else {
      try { localStorage.removeItem('auth_user'); } catch {}
    }
    set({ user, isAuthenticated: !!user });
  },
  setAccessToken: (token) => {
    if (token) {
      try { localStorage.setItem('auth_token', token); } catch {}
    } else {
      try { localStorage.removeItem('auth_token'); } catch {}
    }
    set({ accessToken: token });
  },
  logout: () => {
    try { localStorage.removeItem('auth_user'); localStorage.removeItem('auth_token'); } catch {}
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  hydrate: () => {
    try {
      const userStr = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      if (userStr && token) {
        set({ user: JSON.parse(userStr), accessToken: token, isAuthenticated: true });
      }
    } catch {}
  },
}));
