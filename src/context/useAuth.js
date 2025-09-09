import React from 'react';

const useAuth = () => {
  return localStorage.getItem('isAuthenticated') === 'true' || localStorage.getItem('token') !== null;
};

export default useAuth;