import React from 'react';

const useAuth = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export default useAuth;