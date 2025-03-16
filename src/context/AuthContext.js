import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if there's an existing session
    const session = localStorage.getItem('session');
    if (session) {
      const { expiryTime } = JSON.parse(session);
      if (new Date().getTime() < expiryTime) {
        return true;
      }
      // Remove expired session
      localStorage.removeItem('session');
    }
    return false;
  });

  // Check session expiry every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const session = localStorage.getItem('session');
      if (session) {
        const { expiryTime } = JSON.parse(session);
        if (new Date().getTime() >= expiryTime) {
          setIsAuthenticated(false);
          localStorage.removeItem('session');
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const login = (email, password) => {
    if (email === 'quickcabsservices@gmail.com' && password === 'quickcab@9168') {
      setIsAuthenticated(true);
      
      // Set session with 30-minute expiry
      const expiryTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes
      localStorage.setItem('session', JSON.stringify({
        isAuthenticated: true,
        expiryTime
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('session');
  };

  // Reset session timer when there's user activity
  const resetSessionTimer = () => {
    if (isAuthenticated) {
      const expiryTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes
      localStorage.setItem('session', JSON.stringify({
        isAuthenticated: true,
        expiryTime
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, resetSessionTimer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);