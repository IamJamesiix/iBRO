import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    console.log('Signup called with:', userData); 
     console.log('API baseURL:', api.defaults.baseURL);
    try {
      const { data } = await api.post('/auth/signup', userData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      const message = error.response?.data || 'Signup failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      const message = error.response?.data || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      console.log('🔄 Attempting delete...');
      console.log('Delete URL:', '/auth/delete');
      const response = await api.delete('/auth/delete');
      console.log('✅ Delete response:', response);
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete account');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };