import { formatearFecha, formatearTextoConNegrita } from "./Funciones";

export const GenerarP13 = (doc, contrato) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    const indent = 10; // Sangría para cada línea
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

    // Cuadragésima Cláusula
    let posY = 20;
    doc.text("CUADRAGÉSIMA: INDEPENDENCIA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Si cualquier cláusula, término, convenio, condición, o disposición del presente contrato o la aplicación del mismo, fuese considerada como inválida o inejecutable, el resto de este contrato o su aplicación, no se verá afectado por lo anterior y cada término, convenio, condición o disposición del presente contrato será válida y será ejecutada hasta la extensión más completa permitida por la ley.",
        posY
    );

    // Cuadragésima Primera Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("CUADRAGÉSIMA PRIMERA: NO RENUNCIA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "La inactividad, falta de queja o acción por alguna de LAS PARTES en relación con el incumplimiento o cualquier otro procedimiento derivado del presente contrato, no se estimará como una renuncia a sus derechos por permanecer inactiva o no efectúe los procedimientos establecidos en el contrato.",
        posY
    );

    // Cuadragésima Segunda Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("CUADRAGÉSIMA SEGUNDA: LEGISLACIÓN APLICABLE", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "En todo lo no previsto por LAS PARTES en el presente contrato, ambas se someten a lo establecido por las normas de la Ley General de Sociedades Mercantiles, el Código Civil y demás leyes correspondientes que resulten aplicables.",
        posY
    );

    // Cuadragésima Tercera Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("CUADRAGÉSIMA TERCERA: COMPETENCIA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Para todo lo relacionado con la interpretación y cumplimiento del presente contrato, LAS PARTES se someten expresamente a las Leyes y Tribunales del Estado de México, renunciando a cualquier otro fuero que por razón de su domicilio presente o futuro les pudiera corresponder.",
        posY
    );

    // Texto Final
    posY += 10;
    posY = agregarDeclaracionEnLinea(
        `LAS PARTES estando conformes con el contenido y clausulado del presente contrato lo firman en Ensenada Baja California, el {bold}${formatearFecha(contrato.fechaFirma)}{/bold}, al margen en cada una de sus hojas y al final en esta última para todos los efectos legales a que haya lugar.`,
        posY
    );

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP13;
