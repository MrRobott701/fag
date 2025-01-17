export const GenerarP6 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Décima Segunda Cláusula
    let posY = 20;
    doc.text("DÉCIMA SEGUNDA: RESPONSABILIDAD OPERATIVA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaSegunda = "Respecto de las responsabilidades operativas dentro del negocio EL CONDUCTOR acuerda apegarse en todo momento a lo establecido en los Anexos I y II del presente instrumento.";
    const lineasDecimaSegunda = doc.splitTextToSize(textoDecimaSegunda, pageWidth);
    doc.text(lineasDecimaSegunda, 10, posY + lineSpacing);
    posY += lineasDecimaSegunda.length * lineSpacing + 5;

    const textoDecimaSegunda2 = "Cualquier violación a las mismas será causa especial de rescisión con el pago por daños y perjuicios y las penas convencionales acordadas por LAS PARTES en este Contrato y sus Anexos.";
    const lineasDecimaSegunda2 = doc.splitTextToSize(textoDecimaSegunda2, pageWidth);
    doc.text(lineasDecimaSegunda2, 10, posY + lineSpacing);
    posY += lineasDecimaSegunda2.length * lineSpacing + 10;

    // Décima Tercera Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA TERCERA: CONTABILIDAD", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaTercera = "LAS PARTES convienen que, para efectos tributarios, el presente contrato deberá tener contabilidad independiente. En consecuencia, EL SOCIO deberá contratar, los servicios de un contador público colegiado a fin de que lleve la contabilidad del NEGOCIO.";
    const lineasDecimaTercera = doc.splitTextToSize(textoDecimaTercera, pageWidth);
    doc.text(lineasDecimaTercera, 10, posY + lineSpacing);
    posY += lineasDecimaTercera.length * lineSpacing + 5;

    const textoDecimaTercera2 = "Así mismo, LAS PARTES convienen expresamente que los gastos generados por lo previsto en el párrafo anterior y otros que se efectúen en el decurso del NEGOCIO de acuerdo al giro del mismo, serán asumidos dentro de los Gastos Operativos del NEGOCIO.";
    const lineasDecimaTercera2 = doc.splitTextToSize(textoDecimaTercera2, pageWidth);
    doc.text(lineasDecimaTercera2, 10, posY + lineSpacing);
    posY += lineasDecimaTercera2.length * lineSpacing + 10;

    // Décima Cuarta Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA CUARTA: CAUSAS DE RESCISIÓN", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaCuarta = "Serán causales de rescisión del presente contrato en los casos previstos por la ley como son:";
    const lineasDecimaCuarta = doc.splitTextToSize(textoDecimaCuarta, pageWidth);
    doc.text(lineasDecimaCuarta, 10, posY + lineSpacing);
    posY += lineasDecimaCuarta.length * lineSpacing + 5;

    // Sub-apartados de la décima cuarta cláusula
    posY = agregarDeclaracionConTab("1. Por infracción o incumplimiento al presente Contrato o sus Anexos.", posY, doc);
    posY = agregarDeclaracionConTab("2. Por comisión de actos fraudulentos o dolosos en nombre o contra el NEGOCIO, objeto del presente contrato.", posY + 5, doc);
    posY = agregarDeclaracionConTab("3. Por quiebra, interdicción o inhabilitación para ejercer el comercio por parte de EL SOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("4. Cuando EL VEHÍCULO quede fuera de servicio por causas imputables a EL CONDUCTOR.", posY + 5, doc);
    posY = agregarDeclaracionConTab("5. Cuando EL NEGOCIO, quede fuera de servicio por causas ajenas a LAS PARTES.", posY + 5, doc);
    posY = agregarDeclaracionConTab("6. Por ineficiencia y/o falta de calidad en la prestación del servicio.", posY + 5, doc);
    posY = agregarDeclaracionConTab("7. Por daño al VEHÍCULO, golpes, mal estado de interiores, siendo estos de manera enunciativa y no limitativa.", posY + 5, doc);
    posY = agregarDeclaracionConTab("8. Por un uso del VEHÍCULO que no sea exclusivo del NEGOCIO.", posY + 5, doc);

    // Décima Quinta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA QUINTA: TERMINACIÓN ANTICIPADA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaQuinta = "LAS PARTES pueden dar por terminado en cualquier tiempo el presente Contrato, mediante aviso por escrito que se entregue a la contraparte con cuando menos 20 (veinte) días naturales de anticipación a la fecha en que de por terminado el Contrato, sin responsabilidad alguna de LAS PARTES y sin necesidad de declaración judicial prevista.";
    const lineasDecimaQuinta = doc.splitTextToSize(textoDecimaQuinta, pageWidth);
    doc.text(lineasDecimaQuinta, 10, posY + lineSpacing);
    posY += lineasDecimaQuinta.length * lineSpacing + 5;

    const textoDecimaQuinta2 = "Durante este lapso de tiempo, EL CONDUCTOR se obliga a concluir los trabajos y pagos pendientes entre LAS PARTES. Así mismo, EL SOCIO tendrá oportunidad de cerciorarse de la entrega de EL VEHÍCULO, así como de la autenticidad de la documentación que obre en poder de EL CONDUCTOR.";
    const lineasDecimaQuinta2 = doc.splitTextToSize(textoDecimaQuinta2, pageWidth);
    doc.text(lineasDecimaQuinta2, 10, posY + lineSpacing);
    posY += lineasDecimaQuinta2.length * lineSpacing + 10;

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

export default GenerarP6;
