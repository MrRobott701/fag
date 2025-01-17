export const GenerarP7 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Título
    let posY = 20;
    doc.text("DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoIntro = "Para efecto de mantener en óptimas condiciones de trabajo el VEHÍCULO, cada una de LAS PARTES, acuerda:";
    const lineasIntro = doc.splitTextToSize(textoIntro, pageWidth);
    doc.text(lineasIntro, 10, posY + lineSpacing);
    posY += lineasIntro.length * lineSpacing + 10;

    // Décima Sexta Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA SEXTA: OBLIGACIONES DEL SOCIO RESPECTO DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaSexta = "EL SOCIO se obliga en virtud de este Contrato a:";
    const lineasDecimaSexta = doc.splitTextToSize(textoDecimaSexta, pageWidth);
    doc.text(lineasDecimaSexta, 10, posY + lineSpacing);
    posY += lineasDecimaSexta.length * lineSpacing + 5;

    // Sub-apartados de la décima sexta cláusula
    posY = agregarDeclaracionConTab("1. Entregar el VEHÍCULO al CONDUCTOR en buenas condiciones.", posY, doc);
    posY = agregarDeclaracionConTab("2. Tener toda la documentación de EL VEHÍCULO en regla de acuerdo al Reglamento de Tránsito, donde se incluye el pago de tenencia, verificaciones y de cualquier otra normativa que sea aplicable, según determinen las autoridades competentes.", posY + 5, doc);
    posY = agregarDeclaracionConTab("3. Contratar y mantener vigente durante la vigencia de este instrumento, un Seguro de cobertura AMPLIA, cuya cobertura por responsabilidad civil sea al menos por $3’000,000.00 (Tres Millones de Pesos 00/100 MXN) y la cobertura por gastos médicos de ocupantes de $220,000.00 (Doscientos veinte Mil Pesos 00/100 MXN.) como mínimo.", posY + 5, doc);
    posY = agregarDeclaracionConTab("4. Realizar trabajos de mantenimiento preventivo.", posY + 5, doc);
    posY = agregarDeclaracionConTab("5. Facilitar a EL CONDUCTOR el acceso a toda la documentación de EL VEHÍCULO que sea requerida para su circulación, proporcionándole la Tarjeta de Circulación, placas, engomados, verificaciones y cualquier otro documento que sea requerido por las autoridades competentes, para el desarrollo de EL NEGOCIO.", posY + 5, doc);

    // Décima Séptima Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA SÉPTIMA: OBLIGACIONES DEL CONDUCTOR RESPECTO DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaSeptima = "Independientemente a las demás obligaciones contraídas por EL CONDUCTOR, en virtud de este Contrato, EL CONDUCTOR se obliga respecto del vehículo a:";
    const lineasDecimaSeptima = doc.splitTextToSize(textoDecimaSeptima, pageWidth);
    doc.text(lineasDecimaSeptima, 10, posY + lineSpacing);
    posY += lineasDecimaSeptima.length * lineSpacing + 5;

    // Sub-apartados de la décima séptima cláusula
    posY = agregarDeclaracionConTab("1. Utilizar el VEHÍCULO ÚNICAMENTE para brindar LOS SERVICIOS relacionados con EL NEGOCIO.", posY, doc);
    posY = agregarDeclaracionConTab("2. Mantener en óptimas condiciones de seguridad y de limpieza EL VEHÍCULO, convirtiéndose en el único responsable en todo momento de éste, durante el desempeño de LOS SERVICIOS relacionados con EL NEGOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("3. Responder por los daños causados a EL SOCIO derivados de las gestiones hechas en contravención a lo dispuesto en los lineamientos otorgados por EL SOCIO. Así mismo, en caso de manejar a exceso de velocidad, o bajo el efecto de alguna droga o alcohol, EL CONDUCTOR se obliga a cubrir el 100% de los daños ocasionados al VEHÍCULO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("4. Devolver el VEHÍCULO, sus accesorios y su documentación a la terminación o resolución del contrato en presencia de EL SOCIO, con las mismas características y elementos mencionados en la declaración I.5 las cuales se tienen por reproducidas en esta cláusula como si a la letra se insertaran para todos los efectos legales a que haya lugar. Por lo que responderá de las pérdidas o roturas de componentes, y demás daños que presente el VEHÍCULO.", posY + 5, doc);

    // Texto final
    posY += 5;
    const textoFinal = "De acuerdo a lo establecido en esta cláusula EL CONDUCTOR está consciente por así habérselo explicado, que no existe duda alguna en que su responsabilidad no termina sino hasta el momento en que EL SOCIO se de por recibido a su entera satisfacción del VEHÍCULO.";
    const lineasTextoFinal = doc.splitTextToSize(textoFinal, pageWidth);
    doc.text(lineasTextoFinal, 10, posY + lineSpacing);

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

// Función para agregar texto con sangría en todas las líneas
const agregarDeclaracionConTab = (texto, posY, doc) => {
    const pageWidth = 170; // Ancho de página disponible para el contenido
    const indent = 10; // Sangría para cada línea
    const lineSpacing = 5; // Espaciado entre líneas
    const lineas = doc.splitTextToSize(texto, pageWidth);
    lineas.forEach((linea, index) => {
        doc.text(linea, 10 + indent, posY + (index * lineSpacing));
    });
    return posY + (lineas.length * lineSpacing);
};

export default GenerarP7;
