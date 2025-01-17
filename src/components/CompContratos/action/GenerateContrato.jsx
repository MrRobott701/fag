import { jsPDF } from "jspdf";
import axiosInstance from '../../../axiosConfig.js';
import Swal from 'sweetalert2';
import { sendUpload } from "../../sendUpload";
import { GenerarPortada } from "./CompContratoPDF/Portada";
import { GenerarP1 } from "./CompContratoPDF/Pag1";
import { GenerarP2 } from "./CompContratoPDF/Pag2";
import { GenerarP3 } from "./CompContratoPDF/Pag3";
import { GenerarP4 } from "./CompContratoPDF/Pag4";
import { GenerarP5 } from "./CompContratoPDF/Pag5";
import { GenerarP6 } from "./CompContratoPDF/Pag6";
import { GenerarP7 } from "./CompContratoPDF/Pag7";
import { GenerarP8 } from "./CompContratoPDF/Pag8";
import { GenerarP9 } from "./CompContratoPDF/Pag9";
import { GenerarP10 } from "./CompContratoPDF/Pag10";
import { GenerarP11 } from "./CompContratoPDF/Pag11";
import { GenerarP12 } from "./CompContratoPDF/Pag12";
import { GenerarP13 } from "./CompContratoPDF/Pag13";
import { GenerarP14 } from "./CompContratoPDF/Pag14";
import { GenerarDeposito } from "./CompContratoPDF/Deposito";

// Función para obtener los datos del contrato
export const fetchContratoData = async (contrato) => {
  const URI_CONDUCTORES = "https://all-gates.onrender.com/conductores";
  const URI_VEHICULOS = "https://all-gates.onrender.com/vehiculos";
  const URI_PROPIETARIOS = "https://all-gates.onrender.com/propietarios";

  try {
    const [conductorRes, vehiculoRes, propietarioRes] = await Promise.all([
      axiosInstance.get(`${URI_CONDUCTORES}/${contrato.idConductor}`),
      axiosInstance.get(`${URI_VEHICULOS}/${contrato.idVehiculo}`),
      axiosInstance.get(`${URI_PROPIETARIOS}/${contrato.idPropietario}`),
    ]);

    return {
      conductor: conductorRes.data || null,
      vehiculo: vehiculoRes.data || null,
      propietario: propietarioRes.data || null,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al obtener datos',
      text: 'No se pudieron obtener los datos necesarios para el PDF.',
    });
    return null;
  }
};

// Función para generar el PDF del contrato con las diferentes páginas
export const generarContratoPdf = (contrato, conductor, vehiculo, propietario) => {
  const doc = new jsPDF();

  // Generación de cada página
  GenerarPortada(doc, contrato, conductor, vehiculo, propietario);
  GenerarP1(doc,contrato,conductor,vehiculo,propietario);
  GenerarP2(doc,conductor);
  GenerarP3(doc);
  GenerarP4(doc);
  GenerarP5(doc,contrato);
  GenerarP6(doc);
  GenerarP7(doc);
  GenerarP8(doc);
  GenerarP9(doc,contrato);
  GenerarP10(doc);
  GenerarP11(doc);
  GenerarP12(doc,propietario,conductor);
  GenerarP13(doc,contrato);
  GenerarP14(doc,contrato,propietario,conductor);
  return doc;
};

export const generarDepositoPdf = (contrato, conductor, propietario) => {
  const doc = new jsPDF();

  GenerarDeposito(doc, contrato, propietario, conductor);

  return doc;
}

// Función principal que combina la recuperación de datos, la generación del PDF y la carga en Google Drive
export const handleGenerarPdfContrato = async (contrato) => {
  const URI_CONTRATOS = "https://all-gates.onrender.com/contratos";
  const URI_CONDUCTORES = "https://all-gates.onrender.com/conductores";
  
  const data = await fetchContratoData(contrato);
  if (data) {
    const { conductor, vehiculo, propietario } = data;
    const doc = generarContratoPdf(contrato, conductor, vehiculo, propietario);
    const docDeposito = generarDepositoPdf(contrato, conductor, propietario);

    // Convertir el PDF en Blob
    const pdfBlob = doc.output('blob');
    const pdfDepositoBlob = docDeposito.output('blob');

    // Crear un objeto de archivo para subirlo
    const file = new File([pdfBlob], `${conductor.nombre.toUpperCase()}_CONTRATO.pdf`, {
      type: "application/pdf"
    });
    const fileDeposito = new File([pdfDepositoBlob], `${conductor.nombre.toUpperCase()}_DEPOSITO.pdf`, {
      type: "application/pdf"
    });

    // Mostrar la alerta de carga
    Swal.fire({
      title: 'GUARDANDO CONTRATO',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Subir a Google Drive usando la función sendUpload
    const event = { target: { files: [file] } };  // Simula el evento de input
    const eventDeposito = { target: { files: [fileDeposito] } };  // Simula el evento de input
    try {
      const url = await sendUpload(event);
      const urlDeposito = await sendUpload(eventDeposito);
      
      // Actualizar el contrato con la URL del archivo en Google Drive
      await axiosInstance.put(`${URI_CONTRATOS}/${contrato.id}`, { contratoDoc: url, depositoDoc: urlDeposito });

      // Actualziar idContrato en conductor
      await axiosInstance.put(`${URI_CONDUCTORES}/upContrato/${contrato.idConductor}`, { idContrato: contrato.id});

      Swal.fire({
        icon: 'success',
        title: 'Contrato guardado',
        allowOutsideClick: false,
      });
      console.log("URL del archivo en Drive:", url);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar en Drive',
        allowOutsideClick: false,
      });
      console.error('Error al subir el PDF a Drive:', error);
    }
  }
  document.body.style.overflow = 'visible';
};

