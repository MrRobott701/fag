import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Upload.css';  

const Upload2 = ({ onFileSelected, reDimensions, onCancelUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Método para manejar la selección de archivo
  async function handleFileSelection() {
    const { value: file } = await Swal.fire({
      title: "Selecciona un Archivo",
      input: "file",
      inputAttributes: {
        accept: "application/pdf, image/*",
        "aria-label": "Sube tu Documento o Imagen",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Debes seleccionar un archivo";
        }
      },
      confirmButtonText: "Subir",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33",
      showCloseButton: true,
      reverseButtons: true,
      customClass: {
        input: 'custom-file-input',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        validationMessage: 'custom-validation-message',
      }
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const isImage = file.type.startsWith("image/");
        const isPDF = file.type === "application/pdf";

        if (isImage) {
          Swal.fire({
            title: "Previsualización de la Imagen",
            imageUrl: e.target.result,
            imageAlt: "Imagen seleccionada",
          });
        } else if (isPDF) {
          Swal.fire({
            title: "Previsualización del Documento PDF",
            html: `<iframe src="${e.target.result}" width="100%" height="400px"></iframe>`,
          });
        }
      };

      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        reader.readAsDataURL(file);
      }

      setSelectedFile(file);
      onFileSelected(file);
    }
  }

  // Método para limpiar la selección de archivo
  const handleCancel = () => {
    setSelectedFile(null); // Limpiar el archivo seleccionado
    onFileSelected(null); // Notificar al padre que se canceló la selección
  };

  // Método para la previsualización del archivo seleccionado
  const handlePreviewClick = () => {
    if (!selectedFile) return; // Si no hay archivo seleccionado, no hacer nada

    const reader = new FileReader();
    reader.onload = (e) => {
      const isImage = selectedFile.type.startsWith("image/");
      const isPDF = selectedFile.type === "application/pdf";

      if (isImage) {
        Swal.fire({
          title: "Previsualización de la Imagen",
          imageUrl: e.target.result,
          imageAlt: "Imagen seleccionada",
        });
      } else if (isPDF) {
        Swal.fire({
          title: "Previsualización del Documento PDF",
          html: `<iframe src="${e.target.result}" width="450" height="700px"></iframe>`,
        });
      }
    };

    if (selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf") {
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleFileSelection} className="shadow w-full border-2  bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded">
        Subir Archivo
      </button>
      {selectedFile && (
        <div className="flex flex-col items-center justify-center">
         {selectedFile.type.startsWith("image/") ? (
            <div className="cursor-pointer">
            {reDimensions ? (
            <>
             <h3 className='font-bold text-center'>Previsualización</h3>
          
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Imagen seleccionada"
                className={reDimensions ? "w-lvw h-52 mt-2 cursor-pointer rounded-xl" : "w-50 h-50 mt-2 cursor-pointer"}
                onClick={handlePreviewClick}  // Abrir modal al hacer clic en la imagen
              />
              <div className='flex items-center justify-center'>
                  <button type="button" onClick={handlePreviewClick} className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded mt-2">
                    Ver Imagen
                  </button>
          <button type="button" onClick={onCancelUpload} className="ml-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded mt-2">
            Cancelar
          </button>
            </div>
            </>
            ) : (
                <>
                </>
              )}
            </div>
          ) : selectedFile.type === "application/pdf" ? (
            <div className="cursor-pointer">
              {reDimensions ? (
                <>
                 <h3 className='font-bold text-center'>Previsualización</h3>
          
                  <iframe
                    src={URL.createObjectURL(selectedFile)}
                    title="Previsualización del PDF"
                    className="items-center w-full h-96 md:w-3/4 lg:w-full mt-2 cursor-pointer rounded-xl"
                  />
                  <button type="button" onClick={handlePreviewClick} className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded mt-2">
                    Ver PDF
                  </button>
          {/* Botón de cancelar */}
          <button type="button" onClick={onCancelUpload} className="ml-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded mt-2">
            Cancelar
          </button>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Upload2;
