import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Upload2 from '../../Upload2';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import esLocale from 'date-fns/locale/es';
registerLocale('es', esLocale);
import './DatePickerCustom.css';

const DocumentSection = ({
  title,
  docUrl,
  setDocUrl,
  vencimiento,
  setVencimiento,
  onFileSelected,
  renderPreview,
  handleDeleteFiles,
  docType,
  isDatePicker = true,
}) => {
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar si se está subiendo un archivo
  const [reDimensions, setReDimensions] = useState(false); // Controla cuándo se debe redimensionar

  // Cuando se selecciona un archivo
  const handleFileSelected = (file) => {
    if (file) {
      setIsUploading(true);  // Indicar que se está usando "Upload"
      setReDimensions(true);  // Activar el estado de reDimensions para mostrar la vista previa del archivo cargado
      onFileSelected(file);   // Ejecutar la lógica de selección del archivo (notificar al padre)
    }
  };

  // Función para manejar la cancelación de la carga
  const handleCancelUpload = () => {
    setIsUploading(false);    // Detener el estado de carga
    setReDimensions(false);   // Restablecer la vista previa del archivo existente
    onFileSelected(null);     // Notificar que la subida fue cancelada
  };

  const transformGoogleDriveURL = (url) => {
    const fileIdMatch = url.match(/\/d\/(.*?)\//);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  }
  
  

  return (
    <div
      
      style={{
        padding: '16px',
        borderRadius: '15px',
        border: '5px solid #e0e0e0',
        boxShadow: '0 0 20px rgba(0, 0, 0, .3)', // Sombra alrededor del div
      }}
    >
      <div className="flex flex-col space-y-4">
        { vencimiento ? (
          <>
            {/* Selección de fecha de vencimiento */}
      {isDatePicker && (
        <div className="mt-2">
          <label className="block font-bold mb-1">Fecha de Vencimiento:</label>
          <DatePicker
  selected={vencimiento}
  onChange={(date) => setVencimiento(date)}
  dateFormat="dd/MM/yyyy"
  locale="es"
  className="shadow w-full p-2 rounded border-2 border-gray-400 custom-datepicker text-center"
  placeholderText="Selecciona una fecha"
  showMonthDropdown
  showYearDropdown
  dropdownMode="select"
  minDate={new Date(new Date().getFullYear() - 9, 0, 1)} // 9 años antes de la fecha actual
  maxDate={new Date(new Date().getFullYear() + 4, 11, 31)} // 4 años después de la fecha actual
/>
        

        </div>
      )}
          </>
        ) : (
          <div className="flex flex-col w-full">
            {/* Puedes agregar un mensaje o simplemente dejarlo vacío */}
            <span className="block font-bold"></span>
          </div>
        )}

        {/* Componente de carga de archivos */}
        <Upload2 onFileSelected={handleFileSelected} reDimensions={reDimensions} onCancelUpload={handleCancelUpload} />

        {/* Vista Previa del Documento solo si no está en proceso de subida */}
        {!isUploading && docUrl && (
          <div className="mt-2 pointer-events-none">
            {renderPreview(docUrl, title)}
          </div>
        )}

{/* Botón para eliminar el documento */}
{!isUploading && docUrl && (
  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 w-full">
  {/* Botón para ver el archivo */}
  <button
    type="button"
    className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white p-2 rounded w-full md:w-auto"
    onClick={() => window.open(docUrl, '_blank', 'noopener,noreferrer')} // Abre el archivo en una nueva pestaña
  >
    <i className="fa fa-eye"></i>
    <span className="ml-2">Ver Archivo</span>
  </button>

  {/* Botón para eliminar el archivo */}
  <button
    type="button"
    className="bg-red-600 hover:bg-red-700 hover:shadow-lg text-white p-2 rounded w-full md:w-auto"
    onClick={async () => {
      const { isConfirmed } = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar el archivo de ${title}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (isConfirmed) {
        try {
          Swal.fire({
            title: 'Eliminando...',
            text: `Eliminando el archivo de ${title}. Por favor, espera.`,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await handleDeleteFiles(docUrl, setDocUrl, title); // Pasar el título para la notificación
          Swal.fire({
            icon: 'success',
            title: 'Archivo Eliminado',
            text: `El archivo de ${title} ha sido eliminado correctamente.`,
          });
        } catch (error) {
          console.error('Error al eliminar el archivo:', error);
        }
      }
    }}
  >
    <div className="flex items-center">
      <i className="fa fa-trash"></i>
      <span className="ml-2">Eliminar</span>
    </div>
  </button>
</div>

)}

      </div>
    </div>
  );
};

export default DocumentSection;
