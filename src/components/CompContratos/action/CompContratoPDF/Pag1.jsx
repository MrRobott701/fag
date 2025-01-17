import { formatearFecha, formatearTextoConNegrita } from "./Funciones";

export const GenerarP1 = (doc, contrato, conductor, vehiculo, propietario) => {
    doc.addPage();
    const pageWidth = 180; // Ancho disponible en mm para el contenido
    const indent = 10; // Sangría para todas las líneas de las declaraciones
    const lineSpacing = 5; // Espaciado entre líneas




        // Función para imprimir una declaración en una sola línea, con negrita solo en las variables
        const agregarDeclaracionEnLinea = (texto, posY) => {
            const partesTexto = formatearTextoConNegrita(texto); // Divide el texto en partes según {bold}...{/bold}
            let actualX = 10 + indent; // Posición X inicial
            let actualY = posY;
    
            partesTexto.forEach((parte) => {
                doc.setFont("Helvetica", parte.negrita ? "bold" : "normal");
    
                // Divide el texto en palabras para evitar que se corte a mitad de palabra
                const palabras = parte.texto.split(' ');
    
                palabras.forEach((palabra, index) => {
                    // Calcula el ancho de la palabra y añade un espacio si no es la última palabra del fragmento
                    const anchoPalabra = doc.getTextWidth(palabra + (index < palabras.length - 1 ? ' ' : ''));
    
                    // Verificar si la palabra cabe en el espacio disponible en la línea actual
                    if (actualX + anchoPalabra > pageWidth + 10) {
                        // Salto de línea si la palabra no cabe
                        actualY += lineSpacing;
                        actualX = 10 + indent; // Reiniciar posición X al margen izquierdo
                    }
    
                    // Imprimir la palabra en la posición actual
                    doc.text(palabra, actualX, actualY);
                    actualX += anchoPalabra; // Mover X al final de la palabra actual
                });
    
                // Añadir espacio entre fragmentos en la misma línea si es necesario
                actualX += 2; // Espacio para separar las partes de texto
            });
    
            return actualY + lineSpacing; // Retorna la posición Y al final de la declaración
        };


    doc.setFontSize(10);

    // Fecha alineada a la derecha
    const fechaTexto = `Ensenada Baja California a ${formatearFecha(contrato.fechaFirma)}.`;
    const anchoFecha = doc.getTextWidth(fechaTexto);
    doc.text(fechaTexto, pageWidth - anchoFecha + indent, 20); // Ajusta la posición X para alinearlo a la derecha

    // Texto introductorio
    let posY = 30; // Posición Y después de la fecha
    posY = agregarDeclaracionEnLinea(
        `CONTRATO DE PRESTACIÓN DE SERVICIOS (EN LO SUCESIVO “CONTRATO”) QUE CELEBRAN POR VOLUNTAD Y DERECHO PROPIO {bold}CARLOS ZAMIR FLORES SANTILLAN{/bold} y/o {bold}JAN CARLOS FLORES MUÑOZ{/bold} (NOMBRE DEL DUEÑO) EN LO SUCESIVO “EL SOCIO”, Y {bold}${conductor.nombre.toUpperCase()}{/bold} (NOMBRE DEL CONDUCTOR) EN LO SUCESIVO “EL CONDUCTOR”; QUIÉNES EN CONJUNTO Y EN LO SUCESIVO SE DENOMINARÁN COMO “LAS PARTES” Y SE PRONUNCIAN EN CONFORMIDAD CON LAS DECLARACIONES Y CLÁUSULAS DESCRITAS A CONTINUACIÓN:`,
        posY + 10
    );

    // Sección "DECLARACIONES"
    doc.setFont("Helvetica", "bold");
    doc.text("D E C L A R A C I O N E S", 85, posY + 15);
    doc.text("I. Declara “EL SOCIO” (ARRENDADOR):", 10, posY + 25);


    // Agregar las cláusulas usando agregarDeclaracionEnLinea
    posY += 35; // Ajusta la posición Y para las declaraciones

    posY = agregarDeclaracionEnLinea(
        // PARA PONER EL NOMBRE DEL OBJETO PROPIETARIO : `1. Ser persona de nacionalidad mexicana o extranjero con permiso de trabajo y residencia, acreditando su identidad con el documento oficial {bold}${propietario.nombreDocumento.toUpperCase()}{/bold} número: {bold}${propietario.nroDocumento.toUpperCase()}{/bold}.`,
        `1. Ser persona de nacionalidad mexicana o extranjero con permiso de trabajo y residencia, acreditando su identidad con el documento oficial {bold}CARLOS ZAMIR FLORES SANTILLAN{/bold} número: {bold}${propietario.nroDocumento.toUpperCase()}{/bold}.`,
        posY + 10
    );

    posY = agregarDeclaracionEnLinea(
        "2. Ser mayor de edad, querer celebrar este contrato por voluntad propia, cumplir con los elementos necesarios para ello y contar con la capacidad para cumplir las obligaciones aquí descritas.",
        posY + 10
    );

    posY = agregarDeclaracionEnLinea(
        `3. Tener domicilio en: {bold}${propietario.direccion.toUpperCase()}{/bold}.`,
        posY + 10
    );

    posY = agregarDeclaracionEnLinea(
        "4. No tener antecedentes penales u otras obligaciones que impidan el cumplimiento de este contrato.",
        posY + 10
    );

    posY = agregarDeclaracionEnLinea(
        `5. Contar con la capacidad legal para ser socio de la empresa descrita en la SEGUNDA CLÁUSULA del contrato y poner a disposición de la misma el vehículo marca{bold}${vehiculo.marca.toUpperCase()}{/bold}versión{bold}${vehiculo.modelo.toUpperCase()}{/bold}color{bold}${vehiculo.color.toUpperCase()}{/bold}modelo{bold}${vehiculo.anio}{/bold}con placas{bold}${vehiculo.placas.toUpperCase()}{/bold}del estado/ciudad{bold}ENSENADA B.C.{/bold}y con números de serie{bold}${vehiculo.numeroSerie.toUpperCase()}{/bold}.`,
        posY + 10
    );

    posY = agregarDeclaracionEnLinea(
        "6. Que el vehículo descrito en el apartado anterior se encuentra en condiciones aptas para el uso como transporte de pasajeros; contando con el siguiente equipamiento en perfecto funcionamiento: ventanas, espejos laterales, luces delanteras y traseras en perfecto funcionamiento, transmisión automática/manual, radio AM/FM, antena, tapetes interiores de plástico, llantas con rines y/o tapones, equipo de herramientas, gato, llanta de repuesto y reflejantes para emergencias.",
        posY + 10
    );

    // Pie de página con número de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP1;
