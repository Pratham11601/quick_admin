// import { useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export const SessionTimeout = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = () => {
//       const session = localStorage.getItem('session');
//       if (session) {
//         const { expiryTime } = JSON.parse(session);
//         if (new Date().getTime() >= expiryTime) {
//           logout();
//           navigate('/admin');
//         }
//       }
//     };

//     if (isAuthenticated) {
//       const interval = setInterval(checkSession, 60000); // Check every minute
//       return () => clearInterval(interval);
//     }
//   }, [isAuthenticated, logout, navigate]);

//   return null;
// }; 