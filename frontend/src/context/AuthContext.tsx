import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiService } from '../services/api';

export type Role = 'traffic_officer' | 'district_admin' | 'state_admin' | null;

interface AuthContextType {
  user: any | null;
  role: Role;
  setUser: (user: any | null) => void;
  setRole: (role: Role) => void;
  login: (identifier: string, passwordPlain: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  setUser: () => {},
  setRole: () => {},
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isDemoMode: false,
  setDemoMode: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setDemoMode] = useState(false);

  const login = async (identifier: string, passwordPlain: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.login(identifier, passwordPlain);
      
      // Handle the mock OTP requirement for STATE_ADMIN if needed, 
      // but for now, assuming response.user is returned directly from login/otp-bypass
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      const userData = response.user;
      setUser(userData);
      
      // Map Backend enum (STATE_ADMIN) to Frontend format (state_admin)
      setRole(userData.role.toLowerCase() as Role);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, role, setUser, setRole, login, logout, isLoading, error,
      isAuthenticated: !!user, isDemoMode, setDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
