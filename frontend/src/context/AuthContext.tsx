import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../services/api';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location: string;
  joinDate: string;
  avatar: string;
  reportingManager: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('employee_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('employee_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const userWithId = { ...userData, id: userData.id || userData._id || '' };
    setUser(userWithId);
    localStorage.setItem('employee_user', JSON.stringify(userWithId));
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const userData: User = {
      id: data._id,
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      designation: data.designation || '',
      department: data.dept || '',
      location: data.location || 'Dewas, MP',
      joinDate: data.joinDate || '',
      avatar: data.avatar || '',
      reportingManager: data.reportingManager || '',
      token: data.token,
    };
    login(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('employee_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    const updated = { ...user, ...updatedData } as User;
    setUser(updated);
    localStorage.setItem('employee_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
