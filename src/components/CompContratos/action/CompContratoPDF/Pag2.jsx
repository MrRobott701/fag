import { formatearTextoConNegrita } from "./Funciones";

export const GenerarP2 = (doc, conductor) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 180; // Ancho disponible en mm para el contenido
    const indent = 10; // Sangría para todas las líneas de las declaraciones
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

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

    // Título de la sección II
    doc.text(`II. “EL CONDUCTOR” (${conductor.nombre.toUpperCase()}) declara por su parte:`, 10, 20);

    // Declaraciones de la sección II
    doc.setFont("Helvetica", "normal");
    let posY = 30;
    posY = agregarDeclaracionEnLinea(
        `1. Ser persona de nacionalidad mexicana o extranjero con permiso de trabajo y residencia, acreditando su identidad con el documento oficial {bold}${conductor.nombreDocumento.toUpperCase()}{/bold} número {bold}${conductor.nroDocumento.toUpperCase()}{/bold}.`,
        posY
    );
    posY = agregarDeclaracionEnLinea(
        "2. Ser mayor de edad, querer celebrar este contrato por voluntad propia, cumplir con los elementos necesarios para ello y contar con la capacidad para cumplir las obligaciones aquí descritas.",
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        `3. Tener domicilio en {bold}${conductor.direccion.toUpperCase()}{/bold}.`,
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        "4. No tener antecedentes penales u otras obligaciones que impidan el cumplimiento de este contrato.",
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        "5. Tener la capacidad y voluntad para aportar sus servicios como conductor y estar calificado para este fin.",
        posY + 5
    );

    // Título de la sección III
    doc.setFont("Helvetica", "bold");
    posY += 15;
    doc.text("III. “LAS PARTES” declaran en conjunto:", 10, posY);
    doc.setFont("Helvetica", "normal");

    // Declaraciones de la sección III
    posY += 10;
    posY = agregarDeclaracionEnLinea(
        "1. Conocer a la empresa UBER y los servicios que dicha empresa ofrece.",
        posY
    );
    posY = agregarDeclaracionEnLinea(
        "2. Que el presente contrato se encuentra sujeto a la relación existente entre UBER y EL SOCIO. Por esta razón en el supuesto de que dicha relación deje de subsistir, dará lugar a la rescisión automática del presente instrumento sin necesidad de requerimiento judicial.",
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        "3. LAS PARTES luego de realizar las pláticas previas necesarias, han decidido celebrar este Contrato de Asociación en Participación, y al efecto se otorgan las siguientes:",
        posY + 5
    );

    // Título "DEFINICIONES"
    posY += 15;
    doc.setFont("Helvetica", "bold");
    doc.text("D E F I N I C I O N E S", 85, posY);

    // Descripción de las definiciones sin tabulación y con ajuste automático al ancho de la página
    doc.setFont("Helvetica", "normal");
    posY += 10;
    const definicionTexto = "Las Partes convienen que para efectos del presente Contrato los términos que a continuación se señalan, cuando sean empleados en mayúsculas, tendrán la definición que a los mismos se les asigna, sin perjuicio de que sean utilizados en singular o en plural o de cualesquiera otros términos que se definan a lo largo del presente Contrato:";
    const lineasDefinicion = doc.splitTextToSize(definicionTexto, pageWidth); // Divide el texto en líneas ajustadas al ancho
    doc.text(lineasDefinicion, 10, posY); // Imprime las líneas sin sangría
    posY += lineasDefinicion.length * lineSpacing;

    // Definiciones
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "1. UBER.- Es una aplicación de teléfonos inteligentes que conecta personas que buscan moverse de un punto a otro con conductores que brindan servicio de transporte privado, mediante una plataforma de reservaciones electrónicas.",
        posY
    );
    posY = agregarDeclaracionEnLinea(
        "2. USUARIO.- Se refiere a cualquier tercero que haga uso de los Servicios de UBER por medio del Negocio del SOCIO y CONDUCTOR.",
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        "3. VEHÍCULO.- Se refiere al vehículo descrito en la Declaración I.5 del presente Contrato, propiedad de EL SOCIO.",
        posY + 5
    );

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP2;
