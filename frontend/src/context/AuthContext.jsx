import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, getMe } from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agrilink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('agrilink_token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
          localStorage.setItem('agrilink_user', JSON.stringify(userData));
        } catch (error) {
          console.error('[Auth Error]', error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    localStorage.setItem('agrilink_token', data.token);
    localStorage.setItem('agrilink_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const registerUser = async (userData) => {
    const data = await register(userData);
    localStorage.setItem('agrilink_token', data.token);
    localStorage.setItem('agrilink_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
