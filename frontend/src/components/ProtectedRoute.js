import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const clinician = JSON.parse(localStorage.getItem('clinician'));

  if (!clinician) {
    return <Navigate to="/clinician-login" replace />;
  }

  return children;
};

export default ProtectedRoute; 