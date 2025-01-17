export function sendUpload(e) {
  return new Promise((resolve, reject) => {
    const file = e.target.files[0];
    if (!file) {
      return reject("No se seleccionó ningún archivo.");
    }

    // Función para subir el archivo directamente (sin conversión)
    const uploadFile = (data, name, type) => {
      const rawLog = data.split(',')[1];
      const dataSend = {
        dataReq: { data: rawLog, name: name, type: type },
        fname: "uploadFilesToGoogleDrive"
      };

      fetch('https://script.google.com/macros/s/AKfycbwOLV2-ZctRlQrV41mzL-YXqmGLqg8_kAlIkT0vAFyYAQ3iz_CD7J3Vd2OJMDk065os/exec',
        {
          method: "POST",
          body: JSON.stringify(dataSend)
        }
      )
      .then(res => res.json())
      .then(a => {
        console.log(a);
        resolve(a.url);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    };

    // Verificar si es imagen
    if (file.type.startsWith('image/')) {
      // Leer archivo como DataURL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (ev) {
        const image = new Image();
        image.src = ev.target.result;
        
        image.onload = function() {
          // Crear canvas para dibujar y convertir a WebP
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);

          // Convertir a WebP con calidad 0.8 (ajustar según necesites)
          const webpData = canvas.toDataURL('image/webp', 0.8);

          // Asumimos el nombre original y cambiamos la extensión a .webp
          const newName = file.name.replace(/\.\w+$/, '') + '.webp';
          uploadFile(webpData, newName, 'image/webp');
        };
      };
    } else {
      // No es una imagen, se sube tal cual está
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (ev) {
        // Cargamos el archivo sin conversión
        uploadFile(ev.target.result, file.name, file.type);
      };
    }
  });
}
