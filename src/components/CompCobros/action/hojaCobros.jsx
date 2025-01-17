import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axiosInstance from '../../../axiosConfig'; 
import Encabezado from "../others/Encabezado";
import DateSelector from "./DateSelector";
import CompViewVehiculo from "../../CompVehiculos/actions/viewVehiculo";

const HojaCobros = ({ isCollapsed, vehiculos, contratos, propietarios, conductores, setShowHojaCobros }) => {
    const [propietariosConConductores, setPropietariosConConductores] = useState([]);
    const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);
    const [showVehiculo, setShowVehiculo] = useState(false);
    const [idConductor, setIdConductor] = useState("");
    const [idVehiculo, setIdVehiculo] = useState("");
    const [idPropietario, setIdPropietario] = useState("");
    const [renta, setRenta] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [cobro, setCobro] = useState(0); 
    const [deuda, setDeuda] = useState(0);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [nota, setNota] = useState("");
    const [activo, setActivo] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [indice, setIndice] = useState(0);
	const URI = 'https://all-gates.onrender.com/cobros';
    console.log("URI: ", URI);
    const navigate = useNavigate();

// Actualiza el estado con deudas correctamente
useEffect(() => {
    
    const cargarDatos = async () => {
        try {
            // Obtiene los cobros desde la API
            const { data: cobrosData } = await axiosInstance.get(URI);
            console.log("Cobros:", cobrosData);

            // Agrupa los cobros por conductor
            const deudaPorConductor = calcularDeudaPorConductor(cobrosData);

            // Mapea los propietarios con conductores
            const mappedData = propietarios.map((propietario) => {
                const contratosDelPropietario = contratos.filter(
                    (contrato) => contrato.idPropietario === propietario.id
                );

                const conductoresAsignados = contratosDelPropietario.map((contrato, index) => {
                    const conductor = conductores.find(
                        (conductor) => conductor.id === contrato.idConductor
                    );

                    if (!conductor) return null;

                    // Obtiene la deuda acumulada para el conductor
                    const deudaInfo = deudaPorConductor[conductor.id] || { deuda: "" };

                    const renta = contrato.precioRenta || 0;
                    const saldo = ""; // Saldo acumulado
                    const deuda = deudaInfo.deuda; // Deuda acumulada
                    const total = renta - saldo; // Total considerando deuda
                    const vehiculo = contrato.idVehiculo || "No asignado";

                    return {
                        ...conductor,
                        idContrato: contrato.id,
                        idPropietario: propietario.id,
                        renta,
                        saldo,
                        deuda,
                        total,
                        nota: "",
                        vehiculo,
                        index: index + 1,
                    };
                }).filter(Boolean);

                return {
                    ...propietario,
                    conductores: conductoresAsignados,
                };
            });

            // Actualiza el estado
            setPropietariosConConductores(mappedData);
        } catch (error) {
            console.error("Error al obtener los cobros:", error.message);
        }
    };

    cargarDatos();
}, [propietarios, contratos, conductores]);



    const handleFechaChange = (inicio, fin) => {
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`);
        };

        const Finicio = parseDate(inicio).toISOString(); 
        const Ffin = parseDate(fin).toISOString(); 

        setFechaInicio(Finicio);
        setFechaFin(Ffin);

        console.log("Fecha Inicio: ", Finicio, "Fecha Fin: ", Ffin);
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handlerentaChange = (e) => {
        const value = e.target.value;
        setRenta(value);

        setPropietariosConConductores(prevState => {
            return prevState.map(propietario => {
                return {
                    ...propietario,
                    conductores: propietario.conductores.map(conductor => {
                        if (conductor.id === e.target.name) {
                            const updatedCobro = value - conductor.saldo; 
                            return {
                                ...conductor,
                                renta: value,
                                total: updatedCobro,
                                cobro: updatedCobro,  
                            };
                        }
                        return conductor;
                    }),
                };
            });
        });
    };

    const handlesaldoChange = (e) => {
        const value = e.target.value;
        setSaldo(value);

        setPropietariosConConductores(prevState => {
            return prevState.map(propietario => {
                return {
                    ...propietario,
                    conductores: propietario.conductores.map(conductor => {
                        if (conductor.id === e.target.name) {
                            const updatedCobro = conductor.renta - value; 
                            return {
                                ...conductor,
                                saldo: value,
                                total: updatedCobro,
                                cobro: updatedCobro,  
                            };
                        }
                        return conductor;
                    }),
                };
            });
        });
    };

    const calcularDeudaPorConductor = (cobrosData) => {
        const deudaPorConductor = {};
    
        cobrosData.forEach((cobro) => {
            const idConductor = cobro.idConductor;
    
            // Verifica si ya existe el conductor en el mapa
            if (!deudaPorConductor[idConductor]) {
                deudaPorConductor[idConductor] = {
                    saldo: "",
                    deuda: "",
                };
            }
    
            // Acumula saldo y deuda para ese conductor
            deudaPorConductor[idConductor].deuda = cobro.deuda || "";
        });
    
        return deudaPorConductor;
    };
    

    const handlecobroChange = (e) => {
        setCobro(e.target.value); 
    };

    const handlenotaChange = (e) => {
        setNota(e.target.value);
    };

    const handleInputChange = (e, conductorId, field) => {
        const value = parseFloat(e.target.value) || 0; // Asegura que el valor sea un número o 0
        
        setPropietariosConConductores(prevState =>
            prevState.map(propietario => ({
                ...propietario,
                conductores: propietario.conductores.map(conductor => {
                    if (conductor.id === conductorId) {
                        let updatedCobro = conductor.cobro;
    
                        // CASOS PARA CADA CAMPO
                        if (field === "renta") {
                            updatedCobro = value - conductor.saldo; 
                            return { ...conductor, renta: value, total: updatedCobro, cobro: updatedCobro };
                        } else if (field === "saldo") {
                            updatedCobro = conductor.renta - value; 
                            return { ...conductor, saldo: value, total: updatedCobro, cobro: updatedCobro };
                        } else if (field === "nota") {
                            return { ...conductor, nota: value };
                        } else if (field === "deuda") { // NUEVO CASO
                            return { ...conductor, deuda: value }; // Actualiza el valor editable
                        }
                    }
                    return conductor;
                }),
            }))
        );
    };
    
    
    const handleSave = async () => {
        try {
            Swal.fire({
                title: "Creando Cobros",
                html: "Por favor, espere...",
                didOpen: () => {
                  Swal.showLoading();
                },
                allowOutsideClick: false, // Desactiva clics fuera de la alerta
                allowEscapeKey: false,   // Desactiva la tecla Escape
              });
            for (const propietario of propietariosConConductores) {
                for (const conductor of propietario.conductores) {
                    const cobroData = {
                        idConductor: parseInt(conductor.id),
                        idVehiculo: parseInt(conductor.idVehiculo),
                        idPropietario: parseInt(propietario.id),
                        renta: conductor.renta ? parseFloat(conductor.renta) : 0,
                        saldo: conductor.saldo ? parseFloat(conductor.saldo) : 0,
                        cobro: conductor.cobro ? parseFloat(conductor.cobro) : conductor.renta,
                        deuda: conductor.deuda ? parseFloat(conductor.deuda) : 0,
                        fechaInicio,
                        fechaFin,
                        nota: conductor.nota,
                        activo: parseInt(activo),
                    };

                    console.log("Datos de cobro del conductor: ", cobroData);

                    try {
                        const response = await axiosInstance.post(URI, cobroData);
                        console.log("Respuesta de la API: ", response);

                        if (response.status === 201) {
                            console.log(`Cobro guardado exitosamente para el conductor: ${conductor.id}`);
                        } else {
                            throw new Error(`Error al guardar el cobro para el conductor: ${conductor.id}`);
                        }
                    } catch (error) {
                        console.error(`Error al guardar el cobro para el conductor ${conductor.id}:`, error.message);
                        throw error;  
                    }
                }
            }
            Swal.close();
            Swal.fire({
                title: "¡Guardado!",
                text: "Los cobros se han guardado correctamente",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            }).then(() => {
                setShowHojaCobros(false);
              });
        } catch (error) {
            Swal.fire({
                title: "¡Error!",
                text: "Ha ocurrido un error al guardar los cobros. Verifica los datos.",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            });
        }
    };

    const alertInfo = () => {
        Swal.fire({
            title: "Hoja de Cobros",
            html: `
            <div class="text-center">
                <p>1. Selecciona las <strong>fechas</strong> para los cobros.</p>
                <p>2. Ingresa la <strong>renta</strong> y <strong>saldo</strong> de cada conductor.</p>
                <p class="text-center text-sm">Puedes ver el vehículo asignado a cada conductor.</p>
                <p>3. Haz clic en el botón <strong>Guardar</strong> para crear la hoja.</p>
                <br>
                <p class="text-red-500"><strong>Los conductores que se muestran solo son:</strong></p>
                - Los que tienen un contrato y están activos.</p>
            </div>
            `,
            icon: "question",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
        });
    };

    const closeModal = () => {
        Swal.fire({
            title: "¿Seguro que deseas salir?",
            text: "Los cambios no se guardarán",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#24ab0c",
            cancelButtonText: "No",
            confirmButtonText: "Sí, Salir",
        }).then((result) => {
            if (result.isConfirmed) {
                setShowHojaCobros(false);
            }
        });
    };

    // Nueva función para eliminar conductor
    const handleRemoveConductor = (propietarioId, conductorId) => {
        Swal.fire({
            title: "Remover Conductor de la Lista",
            imageUrl: "   https://cdn-icons-png.flaticon.com/512/564/564619.png ", // URL de un ícono triangular rojo
            imageWidth: 120,
            imageHeight: 120,
            showCancelButton: true,
            confirmButtonText: "Si, Remover",
            cancelButtonText: "No, Cancelar",
            reverseButtons: true,
            customClass: {
              confirmButton: "bg-red-600 text-white font-bold hover:bg-red-700 transform hover:scale-105 focus:outline-none px-4 py-2 rounded",
              cancelButton: "bg-green-600 text-white font-bold hover:bg-green-700 transform hover:scale-105 focus:outline-none px-4 py-2 rounded",
            },
          }).then((result) => {
            if (result.isConfirmed) {
        setPropietariosConConductores((prevPropietarios) =>
            prevPropietarios.map((prop) => {
                if (prop.id === propietarioId) {
                    return {
                        ...prop,
                        conductores: prop.conductores.filter(
                            (conductor) => conductor.id !== conductorId
                        ),
                    };
                }
                return prop;
            })
        );
    }
    });
    };

    const filteredPropietarios = propietariosConConductores.map((propietario) => {
        const filteredConductores = propietario.conductores.filter(conductor =>
            conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            ...propietario,
            conductores: filteredConductores,
        };
    });

    const handleVehiculoClick = (vehiculoId) => {
        setSelectedVehiculoId(vehiculoId);
        setShowVehiculo(true);
    };

    const handleCloseVehiculo = () => {
        setShowVehiculo(false);
    };

    return (
        <>
            <Encabezado />
            <div
                id="fechas"
                className={`pt-24 mr-12 mb-12 transition-all duration-300 ${isCollapsed ? "ml-28" : "ml-28"}`}
            >
                <button className="absolute right-2 -my-5 text-red-500 hover:text-red-800 text-3xl " onClick={closeModal}>
                    <i className="fa-solid fa-circle-xmark"></i>
                </button>
                                     {/* Botón de información en la esquina superior izquierda */}
  <button 
    className="fa-solid fa-circle-question text-4xl absolute hover:scale-125"
    style={{ color: "#0000ff" }}
    onClick={(event) => {
      event.stopPropagation();
      alertInfo();
    }}
  ></button>
                <h1
                className="text-4xl text-center font-bold mb-2 no-select"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
                    <i className="fa-solid fa-file-contract mr-4"></i>
                    Crear Nueva Hoja de Cobros
                </h1>
                <hr className="mb-4 border-gray-800 border-t-8"></hr>
                <div className="shadow-lg border border-gray-300 rounded-lg p-4">
                <DateSelector onFechaChange={handleFechaChange} onSearchChange={handleSearchChange} />

                {filteredPropietarios.map(
                    (propietario) => (
                    <div key={propietario.id} className="mb-8">
                        <div className="flex">
                            <i className="fa-solid fa-user-tie text-4xl mr-4"></i>
                            <p className="font-bold mt-2 text-2xl">{propietario.nombre}</p>
                        </div>
                        {propietario.conductores.length > 0 ? (
                            <table className="text-xl font-bold table-auto w-full">
                                <thead className="shadow-md">
                                    <tr className="bg-black text-white">
                                        <th className="border border-gray-300 p-2 text-center ">No</th>
                                        <th className="border border-gray-300 p-2 text-center w-1/4">Nombre</th>
                                        <th className="border border-gray-300 p-2 text-center w-1/12">Renta</th>
                                        <th className="border border-gray-300 p-2 text-center w-36">Saldo</th>
                                        <th className="border border-gray-300 p-2 text-center w-36">Total</th>
                                        <th className="border border-gray-300 p-2 text-center w-36">Deuda</th>
                                        <th className="border border-gray-300 p-2 text-center">Nota</th>
                                        <th className="border border-gray-300 p-2 text-center w-36">Vehículo</th>
                                        
                                        {/* Nueva columna para el botón "X" */}
                                        <th className="border border-gray-300 p-2 text-center w-10"><i class="fa-solid fa-delete-left"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {propietario.conductores.map((conductor, index) => (
                                        
                                        <tr key={conductor.id} className="shadow-md">
                                            <td className="border bg-gray-100 border-red-500 p-2 text-center">{index + 1}</td>
                                            <td className="border bg-gray-100 border-gray-300 p-2 text-center">{conductor.nombre}</td>
                                            <td className="border bg-gray-100 border-gray-300 p-2 text-center">
                                                <div className="flex items-center justify-end">
                                                    <span className="mr-1">$</span>
                                                    <input
                                                        type="number"
                                                        value={conductor.renta}
                                                        dir="ltr"
                                                        className="w-full text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        onChange={(e) => handleInputChange(e, conductor.id, "renta")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border bg-gray-100 border-gray-300 p-2 text-center">
                                                <div className="flex items-center justify-end">
                                                    <span className="mr-1">$</span>
                                                    <input
                                                        type="number"
                                                        value={conductor.saldo}
                                                        dir="ltr"
                                                        className="w-full text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        onChange={(e) => handleInputChange(e, conductor.id, "saldo")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border bg-gray-100 border-gray-300 p-2 text-center">
    <div className="flex items-center justify-end">
        <span className="mr-1">$</span>
        <input
            type="number"
            value={Number(conductor.total).toFixed(2)}
            step="0.01"
            dir="ltr"
            className="w-full text-center bg-white rounded-md shadow-sm"
            readOnly
            disabled
        />
    </div>
</td>
<td className="border bg-gray-100 border-gray-300 p-2 text-center">
    <div className="flex items-center justify-end">
        <span className="mr-1">$</span>
        <input
            type="number"
            value={conductor.deuda}
            dir="ltr"
            className="w-full text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleInputChange(e, conductor.id, "deuda")} // Capturar cambios
        />
    </div>
</td>

                                            <td className="border bg-gray-100 border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    value={conductor.nota}
                                                    onChange={(e) => handleInputChange(e, conductor.id, "nota")}
                                                    className="w-full text-black text-center text-lg border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="border bg-gray-100 border-gray-300 p-2">
                                                <div className="flex items-center justify-center cursor-pointer text-sm">
                                                    {conductor.idVehiculo ? (
                                                        <button
                                                            onClick={() => handleVehiculoClick(conductor.idVehiculo)}
                                                            className="shadow bg-blue-500 py-2 pr-1 text-white rounded hover:bg-blue-600 font-bold"
                                                        >
                                                            <i className="fa-solid fa-eye ml-1"></i> Vehículo
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="shadow bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 font-bold"
                                                        >
                                                            Sin Vehículo
                                                        </button>
                                                    )}
                                                </div>
                                            </td>



                                            {/* Celda con el botón para remover el conductor */}
                                            <td className="border bg-gray-100 border-gray-300 p-2 text-center">
                                                <button
                                                    onClick={() => handleRemoveConductor(propietario.id, conductor.id)}
                                                    className="text-red-500 hover:text-red-800 font-bold text-xl"
                                                    title="Eliminar Conductor"
                                                >
                                                    <i class="fa-solid fa-circle-minus"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No se encontró conductor</p>
                        )}
                    </div>
                ))}

                {/* Botón de Guardar */}
                <div className="flex justify-center mt-4">
                <div className="mr-4">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>

                {/* Botón para Cancelar */}
                <div>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={closeModal}
                    >
                        Cancelar
                    </button>
                </div>
                </div>
            </div>
        </div>

        {showVehiculo && (
            <CompViewVehiculo id={selectedVehiculoId} onClose={handleCloseVehiculo} />
        )}
        </>
    );
};

export default HojaCobros;
