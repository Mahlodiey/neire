'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  code?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResponse> => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<AuthResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
          { email, password, name }
        );

        if (response.data.success && response.data.user && response.data.token) {
          setUser(response.data.user);
          setToken(response.data.token);
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        } else {
          throw new Error(response.data.error || 'Signup failed');
        }
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : err instanceof Error
            ? err.message
            : 'Signup failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<AuthResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          { email, password }
        );

        if (response.data.success && response.data.user && response.data.token) {
          setUser(response.data.user);
          setToken(response.data.token);
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        } else {
          throw new Error(response.data.error || 'Login failed');
        }
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : err instanceof Error
            ? err.message
            : 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  const restoreSession = useCallback(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    restoreSession,
    isAuthenticated: !!token,
  };
}
