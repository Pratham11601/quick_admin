// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Sidebar = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       logout();
//       navigate('/admin');
//     }
//   };

//   return (
//     // ... existing sidebar code ...
    
//     <div className="sidebar__bottom" onClick={handleLogout}>
//       <span style={{ cursor: 'pointer' }}>
//         <i className="ri-logout-circle-r-line"></i> Logout
//       </span>
//     </div>
    
//     // ... rest of the component
//   );
// };

// export default Sidebar; 