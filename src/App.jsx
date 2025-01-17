// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompSowPropietarios from "./components/CompPropietarios/actions/mostrarPropietarios.jsx";
import CompCreatePropietarios from "./components/CompPropietarios/actions/crearPropietarios.jsx";
import CompEditPropietarios from "./components/CompPropietarios/actions/editarPropietarios.jsx";
import CompShowConductores from "./components/CompConductores/action/mostrarConductor.jsx";
import CompCreateConductores from "./components/CompConductores/action/crearConductor.jsx";
import CompEditConductores from "./components/CompConductores/action/editarConductor.jsx";
import CompShowVehiculos from "./components/CompVehiculos/actions/mostrarVehiculo.jsx";
import CompCreateVehiculos from "./components/CompVehiculos/actions/crearVehiculo.jsx";
import CompEditVehiculos from "./components/CompVehiculos/actions/editarVehiculo.jsx";
import CompContratos from "./components/CompContratos/action/mostrarContratos.jsx";
import CompCobros from "./components/CompCobros/action/mostrarCobros.jsx";
import TablaCobros from "./components/CompCobros/action/tablaCobros.jsx";
import NotFound from "./components/NotFound.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/CompHome/actions/Home.jsx";
import Nav from "./components/Nav.jsx";
import Login from "./components/Auth/Login.jsx";
import Users from "./components/Auth/users.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from './components/Auth/PrivateRoute.jsx';
import CompMantenimiento from "./components/CompMantenimiento/actions/Mantenimiento.jsx";
import { is } from "date-fns/locale";

function App() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent({ isCollapsed, setIsCollapsed }) {
  const { authToken } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {/* Mostrar Nav solo si el usuario está autenticado */}
      {authToken && <Nav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      
      <div
        className={`flex-grow transition-all duration-300 ${authToken && !isCollapsed ? "ml-32" : ""}`}
      >
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users isCollapsed={isCollapsed}/>} />
            <Route path="/propietarios" element={<CompSowPropietarios isCollapsed={isCollapsed} />} />
            <Route path="/create" element={<CompCreatePropietarios />} />
            <Route path="/edit/:id" element={<CompEditPropietarios />} />
            <Route path="/conductores" element={<CompShowConductores isCollapsed={isCollapsed} />} />
            <Route path="/createConductor" element={<CompCreateConductores />} />
            <Route path="/editConductor/:id" element={<CompEditConductores />} />
            <Route path="/vehiculos" element={<CompShowVehiculos isCollapsed={isCollapsed} />} />
            <Route path="/createVehiculo" element={<CompCreateVehiculos />} />
            <Route path="/editVehiculo/:id" element={<CompEditVehiculos />} />
            <Route path="/contratos" element={<CompContratos isCollapsed={isCollapsed} />} />
            <Route path="/cobros" element={<CompCobros isCollapsed={isCollapsed} />} />
            <Route path="/tabla-cobros" element={<TablaCobros isCollapsed={isCollapsed}/>} />
            <Route path="/mantenimiento" element={<CompMantenimiento isCollapsed={isCollapsed} />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
