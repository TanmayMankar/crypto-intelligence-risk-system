/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (credentials) => {
    const result = await loginService(credentials);
    setUser(result.user || null);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await registerService(payload);
    setUser(result.user || null);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      initializeAuth,
    }),
    [user, loading, login, register, logout, initializeAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
