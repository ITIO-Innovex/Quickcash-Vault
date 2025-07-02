import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/jwt';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  user: JwtPayload['data'] | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload['data'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validate token and set user info on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      setToken(storedToken);
      setUser(decoded.data);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

const login = (newToken: string) => {
  if (isTokenValid(newToken)) {
    const decoded = jwtDecode<JwtPayload>(newToken);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(decoded.data);
    setIsAuthenticated(true);
  } else {
    logout();
  }
};
const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
};

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to check if token is valid (not expired)
function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
