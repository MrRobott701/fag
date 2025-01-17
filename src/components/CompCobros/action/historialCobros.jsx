import React, { useEffect, useState } from "react";
import Encabezado from "../others/Encabezado";
import Tabla from "./tabla"; 

const HistorialCobros = ({ cobros, propietarios, setShowHistorialCobros, isCollapsed }) => {
  const [historicoCobros, setHistoricoCobros] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(null); // Estado para almacenar la semana seleccionada
  const [showTable, setShowTable] = useState(false); // Estado para mostrar la tabla de cobros
  const groupByWeek = (cobros) => {
    const groupedByWeek = cobros.reduce((acc, cobro) => {
      const startDate = new Date(cobro.fechaInicio);
      const monday = new Date(startDate);
      monday.setDate(startDate.getDate() - startDate.getDay() + 1);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const weekRange = `${monday.getDate()} de ${monday.toLocaleString("default", { month: "long" })} al ${sunday.getDate()} de ${sunday.toLocaleString("default", { month: "long" })}`;

      if (!acc[weekRange]) {
        acc[weekRange] = {
          renta: 0,
          saldo: 0,
          cobro: 0,
          deuda: 0,
        };
      }

      acc[weekRange].renta += cobro.renta || 0;
      acc[weekRange].saldo += cobro.saldo || 0;
      acc[weekRange].cobro += cobro.cobro || 0;
      acc[weekRange].deuda += cobro.deuda || 0;

      return acc;
    }, {});

    return Object.keys(groupedByWeek).map((week) => ({
      week,
      ...groupedByWeek[week],
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setSelectedMonth(Number(value));
    } else if (name === "year") {
      setSelectedYear(Number(value));
    }
  };

  const handleWeekClick = (week) => {
    setSelectedWeek(week);  // Cambia la semana seleccionada
      };

  useEffect(() => {
    if (cobros.length > 0) {
      const filteredCobros = cobros
        .filter(
          (cobro) =>
            new Date(cobro.fechaInicio).getMonth() + 1 === selectedMonth &&
            new Date(cobro.fechaInicio).getFullYear() === selectedYear
        )
        .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)); // Ordena de más reciente a más antiguo

      const historial = groupByWeek(filteredCobros);
      setHistoricoCobros(historial);
    }
  }, [cobros, selectedMonth, selectedYear]);

  return (
    <>
      <Encabezado />
    {!showTable &&(
        <>
   
      {/* Mostrar el historial solo si no hay semana seleccionada */}
      
        <div className={`pt-20 mr-12 mb-12 transition-all duration-300 ${isCollapsed ? "ml-28" : "ml-28"}`}>
          <div className="bg-gray-200 font-bold mb-4 grid grid-cols-12 gap-4 border p-3 rounded-lg shadow-md">
            <div className="col-end-1">
              <i className=" fa fa-calendar-days text-4xl"></i>
            </div>
            <div className="col-span-1">
              <div className="w-20">
                <select
                  name="year"
                  value={selectedYear}
                  onChange={handleFilterChange}
                  className="border p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ boxShadow: "0px 1px 12px rgba(11, 212, 240)" }}
                >
                  {[...Array(10)].map((_, index) => (
                    <option key={index} value={selectedYear - 5 + index}>
                      {selectedYear - 5 + index}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-1">
              <div className="w-36">
                <select
                  name="month"
                  value={selectedMonth}
                  onChange={handleFilterChange}
                  className="border p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ boxShadow: "0px 1px 12px rgba(11, 212, 240)" }}
                >
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {new Date(0, index).toLocaleString("default", { month: "long" }).toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-center w-full col-span-9">
              <h2 className="text-5xl text-black font-bold no-select" 
              style={{ textShadow: "1px 1px 5px rgba(14, 237, 255)" }}>
                Historial de Cobros
              </h2>
            </div>
          </div>
          <div className="border rounded-xl p-4 shadow">
          {historicoCobros.length > 0 ? (


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {historicoCobros.map((historial, index) => (
                <div
  key={index}
  className="p-3 border rounded-lg hover:scale-105 transition-all duration-500 cursor-pointer bg-gradient-to-br from-black to-blue-950"
  onClick={() => {
    handleWeekClick(historial.week); // Llamamos a la función handleWeekClick
    setShowTable(true); // Mostramos la tabla
  }}
  style={{ boxShadow: "0px 0px 8px rgba(11, 212, 240)" }}
>

                  <h2 className="text-2xl font-bold text-white">Semana:</h2>
                  <p className="text-xl font-bold text-white">{`${historial.week}`}</p>
                  <p className="text-xl font-bold text-white mt-2">Resumen de Cobros:</p>
                  <div className="flex justify-between">
                    <div className="text-white space-y-1">
                      <div className="flex">
                        <p><span className="font-bold">Rentas:</span></p>
                        <p><span className="font-bold text-red-600 ml-1" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0)" }}>
                          ${historial.renta.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span></p>
                      </div>
                      <div className="flex">
                        <p><span className="font-bold">Saldo:</span></p>
                        <p><span className="font-bold text-red-600 ml-1" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0)" }}>
                          ${historial.saldo.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span></p>
                      </div>
                    </div>
                    <div className="text-white space-y-1">
                      <div className="flex">
                        <p><span className="font-bold ml-3">Cobros:</span></p>
                        <p><span className="font-bold text-red-600 ml-1" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0)" }}>
                          ${historial.cobro.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span></p>
                      </div>
                      <div className="flex">
                        <p><span className="font-bold ml-3">Deudas:</span></p>
                        <p><span className="font-bold text-red-600 ml-1" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0)" }}>
                          ${historial.deuda.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="flex items-center justify-center h-12 border rounded-xl shadow">
              <p className="text-xl font-bold">**Sin cobros para mostrar**</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setShowHistorialCobros(false)}
              className="mt-4 text-xl p-2 px-4 font-bold border rounded-md bg-red-500 text-white hover:scale-105 transition-all duration-300 hover:bg-red-700"
            >
              Salir
            </button>
          </div>
        </div>
        </div>
      
      </>
      )}

{selectedWeek && showTable && (
  <Tabla 
    selectedWeek={selectedWeek}
    setShowTable={setShowTable}
  />

     )}
    </>
  );
};

export default HistorialCobros;
