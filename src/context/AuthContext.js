import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const lastLogin = localStorage.getItem('lastLogin');
    if (authStatus && lastLogin) {
      const currentTime = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      if (currentTime - parseInt(lastLogin, 10) > thirtyMinutes) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('lastLogin');
        return false;
      }
    }
    return authStatus;
  });

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const lastLogin = localStorage.getItem('lastLogin');
        if (lastLogin) {
          const currentTime = new Date().getTime();
          const thirtyMinutes = 30 * 60 * 1000;
          if (currentTime - parseInt(lastLogin, 10) > thirtyMinutes) {
            logout();
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const login = (username, password) => {
    if (username === 'quickcabsservices@gmail.com' && password === 'quickcab@9168') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('lastLogin', new Date().getTime().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
