import React from 'react';
import { useAuth } from '../context/AuthContext';

function SomeComponent() {
  const { authToken, setAuthToken, logout } = useAuth();

  const handleLogin = () => {
    // Simulación de autenticación
    setAuthToken('new-token');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {authToken ? (
        <div>
          <p>Usuario autenticado</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Iniciar sesión</button>
      )}
    </div>
  );
}

export default SomeComponent;
