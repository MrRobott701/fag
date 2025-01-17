// ContratoCard.js
import React, { useState, useEffect } from "react";
import {formatearFecha, formatearNumero} from "./../others/formatFecha";
import Swal from "sweetalert2";

const ContratoCard = ({ contrato, onView, onEdit, onDelete }) => {
  const URI_CONDUCTOR = "https://all-gates.onrender.com/conductores";
  const URI_VEHICULO = "https://all-gates.onrender.com/vehiculos";
  const URI_PROPIETARIO = "https://all-gates.onrender.com/propietarios";

  const [conductor, setConductor] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [propietario, setPropietario] = useState(null);


  useEffect(() => {
    // Fetch conductor data
    const fetchConductor = async () => {
      try {
        const response = await fetch(`${URI_CONDUCTOR}/${contrato.idConductor}`);
        const data = await response.json();
        setConductor(data);
      } catch (error) {
        console.error("Error fetching conductor:", error);
      }
    };

    // Fetch vehiculo data
    const fetchVehiculo = async () => {
      try {
        const response = await fetch(`${URI_VEHICULO}/${contrato.idVehiculo}`);
        const data = await response.json();
        setVehiculo(data);
      } catch (error) {
        console.error("Error fetching vehiculo:", error);
      }
    };

    // Fetch propietario data
    const fetchPropietario = async () => {
      try {
        const response = await fetch(`${URI_PROPIETARIO}/${contrato.idPropietario}`);
        const data = await response.json();
        setPropietario(data);
      } catch (error) {
        console.error("Error fetching propietario:", error);
      }
    };

    fetchConductor();
    fetchVehiculo();
    fetchPropietario();
  }, [contrato.idConductor, contrato.idVehiculo, contrato.idPropietario]);

  const alertInfo = () => {
    Swal.fire({
      title: "Fechas del Contrato",
      html: `
        <p><strong>El contrato se renovará de forma automática e indefinida, a menos que sea solicitada su cancelación antes de la fecha de vencimiento: ${formatearFecha(contrato.fechaFin)}</strong></p>
      `,
      icon: "info",
      confirmButtonText: "Entendido"
    });
  };

  return (
    <>
    <div
  className="select-none border border-blue-500 p-4 rounded-lg text-lg relative hover:scale-105 transition-all duration-300 "
  style={{ boxShadow: "0px 0px 8px rgba(245, 101, 39, 0.8)" }}
  onClick={() => onView(contrato.id)}
>

     {/* Botón de información en la esquina superior izquierda */}
  <button 
    className="fa-solid fa-info-circle text-2xl absolute top-2 left-2 hover:scale-125"
    style={{ color: "#0000ff" }}
    onClick={(event) => {
      event.stopPropagation();
      alertInfo();
    }}
  ></button>
  
  {/* Título centrado */}
  <div className="text-center">
    <h2 
      className="text-xl font-bold mb-2 no-select"
      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
    >
      {conductor ? conductor.nombre : ""}
    </h2>
  </div>


      <hr className="my-2 border-t-4 border-yellow-600 " />
      <p><strong>Arrendador:</strong><br/> {propietario ? propietario.nombre : ""}</p>
      <hr className="my-2 border-t-2" />
      
      <div className="flex justify-center ">
  <p className="text-center font-bold justify-center">Fechas del Contrato</p>
</div>



      <div className="flex justify-between text-center">
      
      <p><strong>Inicio</strong> {formatearFecha(contrato.fechaInicio)}</p>
      <p><strong>Fin</strong> {formatearFecha(contrato.fechaFin)}</p>
      </div>
      <hr className="my-2 border-t-2" />

      <div className="flex justify-between">
      <p><strong>Depósito: <a className="text-blue-600">${formatearNumero(contrato.precioDeposito)}.00</a></strong></p>
      <p><strong>Renta: <a className="text-blue-600">${formatearNumero(contrato.precioRenta)}.00</a></strong></p>
      </div>
      <div className="flex justify-between">
      <p><strong>Pagaré: <a className="text-blue-600">${formatearNumero(contrato.precioPagare)}.00</a></strong></p>
      <p><strong>Penalidad: <a className="text-blue-600">${formatearNumero(contrato.penalidad)}.00</a></strong></p>
      </div>
      <hr className="my-2 border-t-2" />
      <p>
  <strong>Vehículo:</strong>{" "}
  {vehiculo ? (
    <>
      {vehiculo.marca} {vehiculo.modelo} {vehiculo.color} {vehiculo.anio}{" "}
      <br/><strong>Placas:</strong> {vehiculo.placas}
    </>
  ) : (
    ""
  )}
</p>

      
      <div className="mt-4 flex justify-around">
        <button
        className="shadow bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 font-bold"
        onClick={(event) => {
          event.stopPropagation();
          onView(contrato.id)}}
        >
          <i className="fa-solid fa-eye"></i> Ver
          </button>

        <button
        className="shadow bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 font-bold"
        onClick={(event) => {
          event.stopPropagation();
        onEdit(contrato.id)} }
        >
          <i className="fa-solid fa-user-pen"></i> Editar
          </button>

        <button 
    onClick={(event) => {
      event.stopPropagation();
            onDelete(contrato.id)}}
          className="shadow bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 font-bold"
        >
          <i className="fa-solid fa-trash"></i>
          Eliminar
        </button>
      </div>
    </div>
    </>
  );
};

export default ContratoCard;
