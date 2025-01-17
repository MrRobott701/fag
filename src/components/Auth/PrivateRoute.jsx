// src/components/Auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { authToken } = useContext(AuthContext);
  
  return authToken ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
