export const GenerarP4 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Quinta Cláusula
    let posY = 20;
    doc.text("QUINTA: APORTACIÓN DEL CONDUCTOR", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoQuinta = "En virtud de la Cláusula SEGUNDA del Contrato, EL CONDUCTOR se obliga a poner a disposición del NEGOCIO lo siguiente:";
    const lineasQuinta = doc.splitTextToSize(textoQuinta, pageWidth);
    doc.text(lineasQuinta, 10, posY + lineSpacing);
    posY += lineasQuinta.length * lineSpacing + 5;

    // Sub-apartado de la quinta cláusula
    posY = agregarDeclaracionConTab("1. Desempeñar actividades de Conductor, relacionadas con EL NEGOCIO, en lo sucesivo “LOS SERVICIOS” de acuerdo a los lineamientos, condiciones y obligaciones establecidas en este Contrato y en los Anexos I y II del presente instrumento, mismos que firmados por LAS PARTES, formarán parte integral de éste; utilizando el VEHÍCULO puesto a disposición por EL SOCIO.", posY, doc);

    // Sexta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("SEXTA: OBLIGACIONES DEL CONDUCTOR", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoSexta = "De manera enunciativa más no limitativa, EL CONDUCTOR se obliga a:";
    const lineasSexta = doc.splitTextToSize(textoSexta, pageWidth);
    doc.text(lineasSexta, 10, posY + lineSpacing);
    posY += lineasSexta.length * lineSpacing + 5;

    // Sub-apartados de la sexta cláusula
    posY = agregarDeclaracionConTab("1. Cumplir con todas y cada una de las obligaciones contenidas en el presente documento, así como labores afines relacionadas y conexas a su aportación que requiera EL NEGOCIO o los USUARIOS.", posY, doc);
    posY = agregarDeclaracionConTab("2. No alegar y/o desconocer las obligaciones, tareas, responsabilidades y alcances que conllevan sus actividades respecto de EL NEGOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("3. Cumplir con las políticas, reglamentos, manuales de procedimientos tanto de UBER, como de tránsito o cualquier otra autoridad relacionada, así como cualquier otro documento presente o futuro con el que tenga que cumplir respecto de EL NEGOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("4. Ajustarse a las normas acordadas con EL SOCIO, respecto de la puntualidad y la dedicación con la que debe desempeñar LOS SERVICIOS, normas que se describen más adelante en el presente instrumento.", posY + 5, doc);
    posY = agregarDeclaracionConTab("5. Mantener en óptimas condiciones de seguridad y de limpieza EL VEHÍCULO, convirtiéndose en el único responsable en todo momento de éste, durante el desempeño de LOS SERVICIOS relacionados con EL NEGOCIO, así como durante el tiempo en el que tenga en posesión el VEHÍCULO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("6. Responder por los daños causados a EL SOCIO derivados de las gestiones hechas en contravención a lo dispuesto en los lineamientos acordados con EL SOCIO, mismos que se establecen en los Anexos I y II del presente Contrato; así como aquellos lineamientos que establezca o llegará a establecer UBER y/o la PLATAFORMA UBER.", posY + 5, doc);
    posY = agregarDeclaracionConTab("7. Someterse a los procedimientos de control de asistencia, limpieza, o cualquier otro que establezca o llegue a establecer EL SOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("8. Cumplir todas las condiciones y especificaciones del servicio que debe ser prestado conforme a los lineamientos establecidos en los Anexo I y II del presente Contrato.", posY + 5, doc);
    posY = agregarDeclaracionConTab("9. Devolver inmediatamente y en óptimas condiciones EL VEHÍCULO a EL SOCIO al momento de concluir el presente instrumento.", posY + 5, doc);

    // Texto final
    posY += 10;
    const textoFinal = "EL CONDUCTOR se obliga a desarrollar las actividades mencionadas en esta cláusula con toda diligencia a efecto de dejar plenamente satisfecho a EL SOCIO y/o a los USUARIOS, aportando toda su experiencia y capacidad en el área de Manejo de Vehículo por el bien de EL NEGOCIO.";
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

export default GenerarP4;
