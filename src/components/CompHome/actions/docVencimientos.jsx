import React, { useState } from "react";
import CompViewVehiculo from "../../CompVehiculos/actions/viewVehiculo";

// Función para obtener la fecha de hoy sin ajuste de zona horaria
const getTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

// Función para comparar las fechas
const compareDates = (dateStr) => {
  const today = new Date(getTodayDate());
  const expirationDate = new Date(dateStr);
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);

  today.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);
  oneMonthLater.setHours(0, 0, 0, 0);

  if (expirationDate < today) return "vencido";
  if (expirationDate <= oneMonthLater) return "pronto";
  return "ok";
};

// Función para convertir cadena de fecha sin perder un día
const formatDateString = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`; // Ajusta el formato según tus necesidades
};

const DocVencimientos = ({ vehiculos }) => {
  const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);

  const processDocuments = (vehiculo) => {
    const documentos = [
      { name: "Imos Permiso", expiration: vehiculo.imosVencimiento, url: vehiculo.imosPermiso },
      { name: "Placas", expiration: vehiculo.placasVencimiento, url: vehiculo.placasDoc },
      { name: "Póliza de Seguro", expiration: vehiculo.polizaSeguroVencimiento, url: vehiculo.polizaSeguro },
      { name: "Revisión Mecánica", expiration: vehiculo.revisionMecanicaVencimiento, url: vehiculo.revisionMecanica },
      { name: "Tarjeta de Circulación", expiration: vehiculo.tarjetaCirculacionVencimiento, url: vehiculo.tarjetaCirculacion },
    ];

    return documentos.map((doc) => ({
      ...doc,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      placas: vehiculo.placas,
      status: compareDates(doc.expiration),
      expiration: formatDateString(doc.expiration), // Usamos la función personalizada aquí
      vehiculoId: vehiculo.id,
    }));
  };

  const documentosVencidosYProntosAVencer = vehiculos.flatMap(processDocuments).filter(doc => doc.status !== "ok");

  const handleRowClick = (vehiculoId) => {
    setSelectedVehiculoId(vehiculoId);
  };

  const handleClose = () => {
    setSelectedVehiculoId(null);
  };

  return (
    <div className="ml-2">
      <div className="flex justify-center items-center">
        <i className="fa-solid fa-paste text-2xl mr-2"></i>
        <h1 className="text-2xl font-bold mb-2 text-center">Documentos Prontos a Vencer</h1>
      </div>
      <div className="overflow-y-auto max-h-[500px] w-full shadow-xl rounded-lg">

      <table className="font-bold text-lg w-full rounded-lg">
  <thead className="sticky top-0 bg-black text-white z-10">
    <tr>
      <th className="border text-center w-[15%]">Marca</th>
      <th className="border text-center w-[18%]">Modelo</th>
      <th className="border text-center w-[15%]">Color</th>
      <th className="border text-center w-[15%]">Placas</th>
      <th className="border text-center w-[30%]">Documento</th>
      <th className="border text-center w-full whitespace-normal">Fecha de Vencimiento</th>
    </tr>
  </thead>
  <tbody className="text-base text-white cursor-pointer" style={{ textShadow: "1px 1px 5px rgba(0, 0, 0)" }}>
    {documentosVencidosYProntosAVencer.map((doc, index) => {
      const rowClass = doc.status === "vencido" ? "bg-red-600 hover:bg-red-500" : doc.status === "pronto" ? "bg-orange-500 hover:bg-orange-600" : "";
      return (
        <tr key={index} className={rowClass} onClick={() => handleRowClick(doc.vehiculoId)}>
          <td className="px-2 py-1 border text-center w-[100px]">{doc.marca}</td>
          <td className="px-2 py-1 border text-center w-[100px]">{doc.modelo}</td>
          <td className="px-2 py-1 border text-center w-[100px]">{doc.color}</td>
          <td className="px-2 py-1 border text-center w-[150px]">{doc.placas}</td>
          <td className="px-2 py-1 border text-center w-[150px]">{doc.name}</td>
          <td className="px-2 py-1 border text-center w-[200px] whitespace-normal">{doc.expiration}</td>
        </tr>
      );
    })}
  </tbody>
</table>

      </div>

      {selectedVehiculoId && (
        <CompViewVehiculo id={selectedVehiculoId} onClose={handleClose} />  
      )}
    </div>
  );
};

export default DocVencimientos;
