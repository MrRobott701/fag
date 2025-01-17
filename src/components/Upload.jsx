import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Upload.css';  
import construccion from '../images/construccion.jpg';

const Upload = ({ onFileSelected }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleFileSelection() {
    const { value: file } = await Swal.fire({
      title: "Selecciona un Archivo",
      input: "file",
      inputAttributes: {
        accept: "application/pdf, image/*",  // Permitimos PDFs e imágenes
        "aria-label": "Sube tu Documento o Imagen",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Debes seleccionar un archivo";
        }
      },
      confirmButtonText: "Subir",  // Cambiado de "Subir" a "Guardar" según tu descripción
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33",
      showCloseButton: true,
      reverseButtons: true,  // Aseguramos que los botones no se inviertan
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

  const handlePreviewClick = () => {
    if (!selectedFile) return;

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
<button type="button" onClick={handleFileSelection} className="shadow w-full border-2  bg-blue-600 hover:bg-blue-800 text-white p-2 rounded">
Subir Archivo
      </button>
      {selectedFile && (
        <div className="flex flex-col items-center justify-center">
          <p>Previsualización:</p>
          {selectedFile.type.startsWith("image/") ? (
            <>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Imagen seleccionada"
                className="w-50 h-50 mt-2 cursor-pointer"
                onClick={handlePreviewClick}  // Abrir modal al hacer clic en la imagen
              />
              <button type="button" onClick={handlePreviewClick} className="bg-slate-600 hover:bg-black text-white p-2 rounded mt-2">
                Ver Imagen
              </button>
            </>
          ) : selectedFile.type === "application/pdf" ? (
            <div
              className="cursor-pointer"
              onClick={handlePreviewClick}  // Abrir modal al hacer clic en el contenedor del PDF
            >
              <iframe
                src={URL.createObjectURL(selectedFile)}
                width="150px"
                height="150px"
                title="Previsualización del PDF"
                className="mt-2"
              />
              <button type="button" onClick={handlePreviewClick} className="bg-slate-600 hover:bg-black text-white p-2 rounded mt-2">
                Ver PDF
              </button>
            </div>
          ) : null}
        </div>
        
      )}
    </div>
  );
};

export default Upload;
