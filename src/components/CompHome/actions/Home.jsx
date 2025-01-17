import React, { useState, useEffect } from "react";
import Encabezado from "../others/Encabezado";
import VehiculosView from "./mostrarCarros";
import MetricasCobr from './metricasCobros';
import DocVencimientos from './docVencimientos.jsx';

const Home = ({ isCollapsed }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [conductores, setConductores] = useState([]);

  const URI_VEHICULOS = "https://all-gates.onrender.com/vehiculos/activos";
  const URI_PROPIETARIOS = "https://all-gates.onrender.com/propietarios";
  const URI_COBROS = "https://all-gates.onrender.com/cobros/activo";
  const URI_CONDUCTORES = "https://all-gates.onrender.com/conductores/activo";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculosRes, propietariosRes, cobrosRes, conductoresRes] = await Promise.all([
          fetch(URI_VEHICULOS),
          fetch(URI_PROPIETARIOS),
          fetch(URI_COBROS),
          fetch(URI_CONDUCTORES),
        ]);

        const vehiculosData = await vehiculosRes.json();
        const propietariosData = await propietariosRes.json();
        const cobrosData = await cobrosRes.json();
        const conductoresData = await conductoresRes.json();

        setVehiculos(vehiculosData);
        setPropietarios(propietariosData);
        setCobros(cobrosData);
        setConductores(conductoresData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Encabezado />
      <div className={`pt-20 z-10 transition-all duration-300 ${isCollapsed ? "" : "ml-20"}`}>
        {/* Contenedor de dos columnas */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Primera Columna: Vehículos y Métricas */}
          <div className="md:w-5/6 flex flex-col">
            <DocVencimientos vehiculos={vehiculos} />
            {user.inicio === 1 && (
            <MetricasCobr
              cobros={cobros}
              propietarios={propietarios}
              conductores={conductores}
              setShowMetricasCobros={true}
            />
          )}
          </div>

          {/* Segunda Columna: Vehículos */}
          <div className="md:w-1/2 mr-2">
            <VehiculosView />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
