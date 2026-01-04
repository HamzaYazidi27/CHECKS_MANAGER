import { AuthState } from '@/types';
import { authStorage } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    loading: true,
    error: null,
  });

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authStorage.getCurrentUser();
        setState({
          isLoggedIn: !!user,
          user: user || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authStorage.register(email, password, name);
      setState({
        isLoggedIn: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de l\'inscription',
      }));
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authStorage.login(email, password);
      setState({
        isLoggedIn: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la connexion',
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await authStorage.logout();
      setState({
        isLoggedIn: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
