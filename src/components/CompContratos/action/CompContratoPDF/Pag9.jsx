import { numeroALetras, formatearTextoConNegrita } from "./Funciones";

export const GenerarP9 = (doc, contrato) => {
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

    // Vigésima Tercera Cláusula
    let posY = 20;
    doc.text("VIGÉSIMA TERCERA: GARANTÍA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        `EL CONDUCTOR, se obliga a firmar como garantía sobre el VEHÍCULO un {bold}pagaré{/bold} por la cantidad de {bold}$${contrato.precioPagare}.00 Pesos (${numeroALetras(contrato.precioPagare)} pesos mxn){/bold}. Dicho pagaré le será devuelto una vez que se haya dado por terminado el presente contrato.`,
        posY
    );

    // Vigésima Cuarta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA CUARTA: PENA CONVENCIONAL", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Si al momento de finalización del contrato, y no habiendo sido devuelto el VEHÍCULO, EL CONDUCTOR se compromete a pagar por concepto de pena convencional la cantidad de {bold}$500.00{/bold} (QUINIENTOS pesos 00/100 MXN), por cada uno de los días transcurridos desde la fecha de conclusión del presente contrato hasta la fecha de la devolución del VEHÍCULO.",
        posY
    );

    // Vigésima Quinta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA QUINTA: GASTOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Serán por cuenta de EL SOCIO los gastos que se originen por concepto de:",
        posY
    );

    // Sub-apartados de la Vigésima Quinta cláusula (Gastos del SOCIO y del CONDUCTOR)
    posY = agregarDeclaracionEnLinea("• Mantenimiento Preventivo", posY + 2);
    posY = agregarDeclaracionEnLinea("• Seguro de Auto", posY + 2);

    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Así mismo, los gastos que correrán a cuenta del CONDUCTOR serán los siguientes:",
        posY
    );
    posY = agregarDeclaracionEnLinea("• Limpieza del Vehículo", posY + 2);

    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "Con excepción, de los supuestos establecidos en el presente contrato, LAS PARTES acuerdan que los siguientes gastos, serán considerados como Gasto Operativos del NEGOCIO; por lo que ambas PARTES serán responsables de cubrir éstos de manera conjunta:",
        posY
    );
    posY = agregarDeclaracionEnLinea("• Impuestos generados por el NEGOCIO", posY);

    // Vigésima Sexta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA SEXTA: PERCANCES", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "EL CONDUCTOR se compromete a comunicar a EL SOCIO, y a la Compañía de Seguros, con la menor tardanza posible, de cualquier accidente, percance, o golpe en el que se vea implicado el VEHÍCULO, esperar al Ajustador de la Compañía de Seguros, y no establecer ningún tipo de acuerdo o conflicto. Así mismo, se compromete a comunicar también cualquier avería o incidencia de cualquier tipo que afecte al correcto funcionamiento del VEHÍCULO.",
        posY
    );

    posY = agregarDeclaracionEnLinea(
        "En caso que el accidente sea atribuible a EL CONDUCTOR, LAS PARTES acuerdan que EL CONDUCTOR cubrirá el 100% (cien por ciento) del deducible o bien el 100% (cien por ciento) de los gastos de reparación del VEHÍCULO. Y para el caso en que el accidente o percance sea atribuible a un tercero, LAS PARTES establecen que se pagarán dichos gastos evaluando la situación conforme a los porcentajes que acuerden.",
        posY + 5
    );

    posY = agregarDeclaracionEnLinea(
        "De no cumplir con lo establecido en esta Cláusula, EL CONDUCTOR se obliga a cubrir el 100% (cien por ciento) del deducible o en su caso el 100% (cien por ciento) de los gastos de reparación del VEHÍCULO.",
        posY + 5
    );

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP9;
