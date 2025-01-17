import Encabezado from "../others/Encabezado";
import React, { useState, useEffect } from "react";
import HojaCobros from "./hojaCobros";
import TablaCobros from "./tablaCobros";
import HistorialCobros from "./historialCobros";
import MetricasCobros from "./metricasCobros";
const MostrarCobros = (isCollapsed) => {
    const URI_COBROS = "https://all-gates.onrender.com/cobros";
    const URI_VEHICULOS = "https://all-gates.onrender.com/vehiculos";
    const URI_CONDUCTORES = "https://all-gates.onrender.com/conductores/activo";
    const URI_PROPIETARIOS = "https://all-gates.onrender.com/propietarios";
    const URI_CONTRATOS = "https://all-gates.onrender.com/contratos";

    const [cobros, setCobros] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [loading, setLoading] = useState(true);
const [showHojaCobros, setShowHojaCobros] = useState(false); // Nuevo estado para mostrar HojaCobros
    const [showHistorialCobros, setShowHistorialCobros] = useState(false); // Nuevo estado para mostrar HistorialCobros
    const [showMetricasCobros, setShowMetricasCobros] = useState(false); // Nuevo estado para mostrar MetricasCobros
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([getCobros(), getVehiculos(), getConductores(), getPropietarios(), getContratos()]);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getCobros = async () => {
        try {
            const response = await fetch(URI_COBROS);
            if (!response.ok) throw new Error("Error al obtener cobros");
            const data = await response.json();
            setCobros(data);
        } catch (error) {
            console.error("Error en getCobros:", error);
        }
    };

    const getVehiculos = async () => {
        try {
            const response = await fetch(URI_VEHICULOS);
            if (!response.ok) throw new Error("Error al obtener vehículos");
            const data = await response.json();
            setVehiculos(data);
        } catch (error) {
            console.error("Error en getVehiculos:", error);
        }
    };

    const getConductores = async () => {
        try {
            const response = await fetch(URI_CONDUCTORES);
            if (!response.ok) throw new Error("Error al obtener conductores");
            const data = await response.json();
            setConductores(data);
        } catch (error) {
            console.error("Error en getConductores:", error);
        }
    };

    const getPropietarios = async () => {
        try {
            const response = await fetch(URI_PROPIETARIOS);
            if (!response.ok) throw new Error("Error al obtener propietarios");
            const data = await response.json();
            setPropietarios(data);
        } catch (error) {
            console.error("Error en getPropietarios:", error);
        }
    };

    const getContratos = async () => {
        try {
            const response = await fetch(URI_CONTRATOS);
            if (!response.ok) throw new Error("Error al obtener contratos");
            const data = await response.json();
            setContratos(data);
        } catch (error) {
            console.error("Error en getContratos:", error);
        }
    };

    if (loading) return <p>Cargando datos...</p>;

    return (
        <>
            {!showHojaCobros && !showHistorialCobros && !showMetricasCobros && (
                <>
<Encabezado />
      <div className= {`pt-24 mr-12 mb-12 transition-all duration-300 ${
    isCollapsed ? "ml-28" : "ml-28"}`}>
                        {/* Botón para crear Hoja de Cobros */}
                        <div className="flex justify-between">
                        
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 rounded"
                            onClick={() => setShowHojaCobros(true)} // Al hacer clic, muestra HojaCobros
                        >
                        <i className="fa-solid fa-folder-plus mr-2"></i>
                            Crear Hoja de Cobros
                        </button>

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                            onClick={() => setShowHistorialCobros(true)} // Al hacer clic, muestra HojaCobros
                        >
                            <i className="fa-regular fa-calendar-days mr-2"></i>
                            Historial de Cobros
                        </button>

                        <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded"
                            onClick={() => setShowMetricasCobros(true)} // Al hacer clic, muestra HojaCobros
                        >
                            <i className="fa-regular fa-chart-bar mr-2"></i>
                            Métricas de Cobros
                        </button>
                        </div>
                        <TablaCobros
                        cobros={cobros}
                        propietarios={propietarios}
                            />
                    </div>

                </>
            )}
            {showHojaCobros && (
                <HojaCobros
                    vehiculos={vehiculos}
                    conductores={conductores}
                    propietarios={propietarios}
                    contratos={contratos}
                    setShowHojaCobros={setShowHojaCobros}
                />
            )}
            {showHistorialCobros && (
                <HistorialCobros
                    cobros={cobros}
                    propietarios={propietarios}
                    setShowHistorialCobros={setShowHistorialCobros}
                />
            )}
            {showMetricasCobros && (
                <MetricasCobros
                    cobros={cobros}
                    propietarios={propietarios}
                    conductores={conductores}
                    setShowMetricasCobros={setShowMetricasCobros}
                />
            )}
        </>
    );
};
export default MostrarCobros;