// src/components/Layout.jsx
import React from 'react';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';

function Layout({ isCollapsed, setIsCollapsed }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Componente de Navegación */}
      <Nav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Contenido de la Aplicación */}
      <div
        className={`flex-grow transition-all duration-300 ${isCollapsed ? "" : "ml-32"}`}
      >
        <Outlet /> {/* Renderiza las rutas hijas */}
      </div>
    </div>
  );
}

export default Layout;
