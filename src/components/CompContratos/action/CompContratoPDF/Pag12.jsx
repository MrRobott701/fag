import { formatearTextoConNegrita } from "./Funciones";

export const GenerarP12 = (doc, propietario, conductor) => {
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

    // Trigésima Cuarta Cláusula
    let posY = 20;
    doc.text("TRIGÉSIMA CUARTA: DOMICILIOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "LAS PARTES señalan como domicilio para todos los efectos de este contrato, los siguientes:",
        posY
    );

    posY = agregarDeclaracionEnLinea(
        `• EL SOCIO en: {bold}${propietario.direccion.toUpperCase()}{/bold}.`,
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        `• EL CONDUCTOR en: {bold}${conductor.direccion.toUpperCase()}{/bold}.`,
        posY + 5
    );

    posY += 10;
    posY = agregarDeclaracionEnLinea(
        "LAS PARTES deberán informar del cambio en su domicilio, con cuando menos 10 (diez) días hábiles de anticipación. En caso de no hacerlo, todos los avisos, notificaciones y demás diligencias judiciales o extrajudiciales que se hagan en el domicilio indicado por las mismas, en esta cláusula, surtirán plenamente sus efectos.",
        posY
    );

    // Trigésima Quinta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA QUINTA: ENCABEZADOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Los encabezados que hacen referencia al contenido del tipo de relaciones particulares en este contrato, son insertados únicamente para la conveniencia de LAS PARTES y de ninguna manera podrán considerarse como parte de este contrato o como limitación al alcance de cualesquiera de los términos o estipulaciones del mismo.",
        posY
    );

    // Trigésima Sexta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA SEXTA: CESIÓN DEL CONTRATO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "LAS PARTES no pueden ceder, transferir ni delegar el presente contrato o alguna de sus obligaciones, ni subrogar a terceros en cualquier forma válida en derecho, ni gravar o hipotecar alguno de los derechos contemplados en el contrato, sin la previa conformidad escrita de la otra parte.",
        posY
    );

    // Trigésima Séptima Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA SÉPTIMA: MODIFICACIONES", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Este contrato no podrá ser modificado o alterado de ninguna manera, excepto mediante la celebración de un instrumento por escrito suscrito por LAS PARTES. Una vez suscritas dichas modificaciones se convertirán en un parte integrante del presente contrato, sujeto a todos los términos y condiciones contenidos en el mismo y tendrán plena fuerza y causarán todos sus efectos legales.",
        posY
    );

    // Trigésima Octava Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA OCTAVA: CONSENTIMIENTO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Queda pactado por LAS PARTES que el presente contrato es celebrado sin violencia, dolo, error, engaño o mala fe, por lo que no existe algún vicio del consentimiento que limite o pueda limitar los efectos jurídicos del presente contrato.",
        posY
    );

    // Trigésima Novena Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA NOVENA: ACUERDO ÚNICO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Las convenciones y cláusulas contenidas en el presente contrato dejan sin efecto cualquier acuerdo verbal o escrito convenido con anterioridad. Por lo que el presente contrato refleja las condiciones y términos en que LAS PARTES desean obligarse.",
        posY
    );

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP12;
