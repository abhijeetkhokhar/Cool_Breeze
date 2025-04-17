import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, check localStorage for token/user
    const token = localStorage.getItem('riderToken');
    const userData = localStorage.getItem('riderUser');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('riderToken', token);
    localStorage.setItem('riderUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('riderToken');
    localStorage.removeItem('riderUser');
  };

  return (
    <AuthContext.Provider value={{ user, setUser: login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
