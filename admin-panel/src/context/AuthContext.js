import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          // Set auth token header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
          
          // Check if user is admin
          if (data.role !== 'admin') {
            localStorage.removeItem('adminToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
          } else {
            setUser(data);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Admin logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Handle Google login
  const handleGoogleLogin = async (tokenId) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/google`,
        { tokenId }
      );
      
      // Save token to localStorage
      localStorage.setItem('adminToken', data.token);
      
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data
      setUser(data);
      
      // Check if user is admin
      if (data.role !== 'admin') {
        return { 
          success: false, 
          message: 'You do not have admin privileges' 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Authentication failed' 
      };
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        handleGoogleLogin,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
