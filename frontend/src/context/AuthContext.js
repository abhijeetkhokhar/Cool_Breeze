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
      let token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set auth token header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
          
          setUser(data);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Handle Google login
  const handleGoogleLogin = async (tokenId) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, { tokenId });
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data
      setUser(data);
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Authentication failed' 
      };
    }
  };

  // Logout
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user data
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/profile`, userData);
      
      // Update user state
      setUser(data);
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
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
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isRider: user?.role === 'rider'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
