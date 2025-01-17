import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosConfig.js";
import Swal from "sweetalert2";
import CompViewConductor from "../../CompConductores/action/viewConductor"; // Modal para ver conductor
import Encabezado from "../others/Encabezado";

const Tabla = ({ isCollapsed, selectedWeek, setShowTable }) => {
    const [cobros, setCobros] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [modalConductorData, setModalConductorData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const URI_COBROS = "https://bag-st6b.onrender.com/cobros/";
    const URI_CONDUCTORES = "https://bag-st6b.onrender.com/conductores/";
    const URI_PROPIETARIOS = "https://bag-st6b.onrender.com/propietarios/";

    // Fetch data on component mount
    useEffect(() => {
        console.log("Fetching data...");
        console.log("selectedWeek: ", selectedWeek);
        const fetchData = async () => {
            try {
                const cobrosData = await axiosInstance.get(URI_COBROS);
                setCobros(cobrosData.data);

                const conductoresData = await axiosInstance.get(URI_CONDUCTORES);
                setConductores(conductoresData.data);

                const propietariosData = await axiosInstance.get(URI_PROPIETARIOS);
                setPropietarios(propietariosData.data);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los datos.",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar",
                });
            }
        };

        fetchData();
    }, []);

    // Filtrar cobros por la semana seleccionada
    const filterCobrosByWeek = (week) => {
        return cobros.filter((cobro) => {
            const startDate = new Date(cobro.fechaInicio);
            const monday = new Date(startDate);
            monday.setDate(startDate.getDate() - startDate.getDay() + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            const weekRange = `${monday.getDate()} de ${monday.toLocaleString("default", { month: "long" })} al ${sunday.getDate()} de ${sunday.toLocaleString("default", { month: "long" })}`;
            return week === weekRange;
        });
    };

    const filteredCobros = filterCobrosByWeek(selectedWeek);

    // Función para actualizar un campo
    const handleEdit = async (id, field, value) => {
        const updatedCobros = cobros.map((cobro) =>
            cobro.id === id ? { ...cobro, [field]: value } : cobro
        );

        const cobro = updatedCobros.find((cobro) => cobro.id === id);

        // Actualizamos el valor de cobro calculado como renta - saldo
        const updatedCobro = {
            ...cobro,
            cobro: cobro.renta - cobro.saldo, // Calculamos el valor de cobro
        };

        try {
            const response = await axiosInstance.put(`${URI_COBROS}${id}`, updatedCobro);

            if (response.status === 200) {
                setCobros(updatedCobros);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: `No se pudo actualizar ${field}.`,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            });
        }
    };

    const calculateTotals = (cobros) => {
        const totals = cobros.reduce(
            (acc, cobro) => {
                acc.renta += cobro.renta || 0;
                acc.saldo += cobro.saldo || 0;
                acc.cobro += cobro.cobro || 0;
                acc.deuda += cobro.deuda || 0;
                return acc;
            },
            { renta: 0, saldo: 0, cobro: 0, deuda: 0 }
        );
        return totals;
    };

    const getConductorNombre = (id) => {
        const conductor = conductores.find((conductor) => conductor.id === id);
        return conductor ? conductor.nombre : "Desconocido";
    };

    const getPropietarioNombre = (idPropietario) => {
        const propietario = propietarios.find((propietario) => propietario.id === idPropietario);
        return propietario ? propietario.nombre : "Propietario no encontrado";
    };

    // Filtrar cobros por el nombre del conductor
    const filterCobrosByConductorName = (cobros, searchTerm) => {
        if (!searchTerm) return cobros; // Si no hay término de búsqueda, devuelve todos los cobros

        return cobros.filter(cobro => {
            const conductorNombre = getConductorNombre(cobro.idConductor).toLowerCase();
            return conductorNombre.includes(searchTerm.toLowerCase());
        });
    };

    const filteredCobrosByConductor = filterCobrosByConductorName(filteredCobros, searchTerm);

    const groupByPropietario = () => {
        const grouped = filteredCobrosByConductor.reduce((acc, cobro) => {
            const propietarioId = cobro.idPropietario;
            if (!acc[propietarioId]) {
                acc[propietarioId] = [];
            }
            acc[propietarioId].push(cobro);
            return acc;
        }, {});

        return grouped;
    };

    return (
        <>
            <Encabezado />
            <div className={`pt-20 mr-12 mb-12 transition-all duration-300 ${isCollapsed ? "ml-28" : "ml-28"}`}>

                <div className="font-bold grid grid-cols-12 gap-4 border p-3 rounded-lg shadow-md bg-gray-100">
                  <div className="col-end-1">  
                <button
  onClick={() => {
    setShowTable(false); // Oculta la tabla
    
  }}
  className="text-xl p-2 px-4 font-bold border rounded-md bg-green-700 text-white hover:scale-105 transition-all duration-300 hover:bg-green-800"
>
  Salir
</button>
</div>

                    <div className="col-span-1">
                        <i className="fa fa-calendar-days text-4xl"></i>
                    </div>
                    <div className="text-center w-full col-span-7">
                        <h2 className="text-3xl font-bold no-select" 
                        style={{ textShadow: "2px 2px 4px rgba(14, 229, 255)" }}>
                            {selectedWeek}
                        </h2>
                    </div>
                    <div className="col-span-4">
                {/* Driver Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                            type="text"
                            placeholder="Buscar conductor..."
                            className="rounded border-2 border-black pl-10 pr-10 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    {/* Mostrar los cobros filtrados en la tabla, separados por propietarios */}
                    {Object.keys(groupByPropietario()).map((propietarioId) => {
                        const total = calculateTotals(groupByPropietario()[propietarioId]);

                        return (
                            <div key={propietarioId} className="mb-6">
                                <div className="shadow-lg border border-gray-300 rounded-lg p-4">
                                    <div className="flex">
                                        <i className="fa-solid fa-user-tie text-4xl mr-4"></i>
                                        <p className="font-bold mt-2 text-2xl">{getPropietarioNombre(parseInt(propietarioId))}</p>
                                    </div>
                                    <table className="font-bold w-full overflow-visible">
                                        <thead className="text-xl sticky top-16 bg-black text-white z-10">
                                            <tr className="bg-black text-white">
                                                <th className="border border-gray-300 p-2 text-center w-8">No</th>
                                                <th className="border border-gray-300 cursor-pointer p-2 text-center w-96">Nombre Conductor</th>
                                                <th className="border border-gray-300 p-2 text-center w-32">Renta</th>
                                                <th className="border border-gray-300 p-2 text-center w-32">Saldo</th>
                                                <th className="border border-gray-300 p-2 text-center w-32">Cobro</th>
                                                <th className="border border-gray-300 p-2 text-center w-32">Deuda</th>
                                                <th className="border border-gray-300 p-2 text-center w-16">Pago</th>
                                                <th className="border border-gray-300 p-2 text-center">Nota</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupByPropietario()[propietarioId].map((cobro, index) => (
                                                <tr key={cobro.id} className="text-lg bg-gray-100 hover:bg-gray-200">
                                                    <td className="border p-2 text-center">{index + 1}</td>
                                                    <td
                                                        className="cursor-pointer border p-2 text-center"
                                                        onClick={() => {
                                                            setModalConductorData(cobro.idConductor);
                                                            setModalIsOpen(true);
                                                        }}
                                                    >
                                                        {getConductorNombre(cobro.idConductor)}
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <div className="flex justify-center">
                                                            <a className="mr-1">$</a>
                                                            <input
                                                                type="number"
                                                                value={cobro.renta}
                                                                onChange={(e) => handleEdit(cobro.id, "renta", parseFloat(e.target.value))}
                                                                className="w-full text-center border-gray-300 rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <div className="flex justify-center">
                                                            <a className="mr-1">$</a>
                                                            <input
                                                                type="number"
                                                                value={cobro.saldo}
                                                                onChange={(e) => handleEdit(cobro.id, "saldo", parseFloat(e.target.value))}
                                                                className="w-full text-center border-gray-100 rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <div className="flex justify-center">
                                                            <a className="mr-1">$</a>
                                                            <input
                                                                type="number"
                                                                value={(cobro.renta - cobro.saldo).toFixed(2)}
                                                                className="w-full text-center border-gray-300 rounded-md shadow-sm"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <div className="flex justify-center">
                                                            <a className="mr-1">$</a>
                                                            <input
                                                                type="number"
                                                                value={cobro.deuda}
                                                                onChange={(e) => handleEdit(cobro.id, "deuda", parseFloat(e.target.value))}
                                                                className="w-full text-center border-gray-300 rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={cobro.pago === 1}
                                                                onChange={() => handleEdit(cobro.id, "pago", cobro.pago === 1 ? 0 : 1)}
                                                            />
                                                            <div
                                                                className={`z-0 w-11 h-6 rounded-full relative transition-all duration-300 ${cobro.pago === 1 ? 'bg-green-600' : 'bg-gray-600'}`}
                                                            >
                                                                <div
                                                                    className={`absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full transition-transform duration-300 ease-in-out transform ${cobro.pago === 1 ? 'translate-x-5' : ''}`}
                                                                ></div>
                                                            </div>
                                                        </label>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <input
                                                            type="text"
                                                            value={cobro.nota}
                                                            onChange={(e) => handleEdit(cobro.id, "nota", e.target.value)}
                                                            className="w-full text-center border-gray-300 rounded-md shadow-sm"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Totales */}
                                    <div className="mt-4 flex space-x-4 justify-center text-xl">
                                        <div className="text-white bg-blue-900 font-bold px-4 py-2 rounded-md">
                                            Rentas: ${total.renta.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-white bg-blue-900 font-bold px-4 py-2 rounded-md">
                                            Saldos: ${total.saldo.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-white bg-blue-900 font-bold px-4 py-2 rounded-md">
                                            Cobros: ${total.cobro.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-white bg-blue-900 font-bold px-4 py-2 rounded-md">
                                            Deudas: ${total.deuda.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {modalIsOpen && <CompViewConductor id={modalConductorData} setModalIsOpen={setModalIsOpen} />}
        </>
    );
};

export default Tabla;
