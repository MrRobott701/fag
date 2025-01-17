import { numeroALetras, formatearFecha, formatearTextoConNegrita } from "./Funciones";

export const GenerarDeposito = (doc, contrato, propietario, conductor) => {    
    
    // Fecha en la esquina superior derecha, en negrita
    const fecha = contrato.fechaFirma ? formatearFecha(contrato.fechaFirma) : "__ de _____________ del __";
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Ensenada Baja California a ${fecha}.`, 200, 20, { align: "right" }); // Ajustado para alineación superior derecha y en negrita

    // Título del recibo
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE DEPÓSITO", 105, 50, { align: "center" });

    // Cuerpo del recibo con texto en negrita para variables
    const nombreConductor = conductor.nombre ? conductor.nombre.toUpperCase() : "{NOMBRECONDUCTOR}";
    const cantidadDeposito = contrato.precioDeposito ? `$${contrato.precioDeposito}` : "{DEPOSITO}";
    const cantidadDepositoLetra = contrato.precioDeposito ? numeroALetras(contrato.precioDeposito) : "DEPOSITOLETRA";

    // Texto del recibo con etiquetas de negrita
    const textoRecibo = `Recibí de {bold}${nombreConductor}{/bold} la cantidad de {bold}${cantidadDeposito}.00 (${cantidadDepositoLetra} pesos mxn){/bold} como depósito de renta de carro Uber.`;

    // Función para agregar el texto con negrita en las partes indicadas y ajustarlo al ancho de página
    const agregarTextoConNegrita = (texto, posX, posY, maxWidth) => {
        const partesTexto = formatearTextoConNegrita(texto); // Divide el texto en partes según {bold}...{/bold}
        let actualX = posX;
        let actualY = posY;

        partesTexto.forEach((parte) => {
            doc.setFont("Helvetica", parte.negrita ? "bold" : "normal");

            // Divide el texto en palabras para ajustar al ancho de la página
            const palabras = parte.texto.split(' ');
            palabras.forEach((palabra, index) => {
                // Añadir un espacio después de cada palabra, excepto la última
                const palabraConEspacio = palabra + (index < palabras.length - 1 ? ' ' : '');
                const anchoPalabra = doc.getTextWidth(palabraConEspacio);

                // Verificar si la palabra cabe en el espacio restante de la línea actual
                if (actualX + anchoPalabra > posX + maxWidth) {
                    // Salto de línea si no cabe
                    actualY += 6; // Ajuste de espacio entre líneas
                    actualX = posX; // Reiniciar posición X al inicio de la línea
                }

                // Imprimir la palabra en la posición actual
                doc.text(palabraConEspacio, actualX, actualY);
                actualX += anchoPalabra; // Mover X al final de la palabra actual
            });
        });
    };

    // Llamada a la función para agregar el texto del recibo, respetando el ancho máximo de 180 mm
    agregarTextoConNegrita(textoRecibo, 20, 70, 180);

    // Línea para firma del propietario
    doc.setLineWidth(0.5);
    doc.line(60, 150, 150, 150); // Línea centrada para la firma
    doc.setFont("Helvetica", "bold");
    //doc.text(`${propietario.nombre}`, 105, 160, { align: "center" });
    doc.text(`CARLOS ZAMIR FLORES SANTILLAN`, 105, 160, { align: "center" });

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Página ${pageCount}`, 200, 279, { align: "right" });
};

export default GenerarDeposito;
