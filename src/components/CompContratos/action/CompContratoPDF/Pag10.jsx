export const GenerarP10 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Vigésima Séptima Cláusula
    let posY = 20;
    doc.text("VIGÉSIMA SÉPTIMA: MANTENIMIENTO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesimaSeptima = "Durante la vigencia de este contrato EL SOCIO se compromete a realizar un trabajo de Mantenimiento Preventivo se hará atendiendo al manual del vehículo y condiciones del mismo. El Servicio o cualquier otra reparación serán hechos en la agencia o taller que determine el SOCIO.";
    const lineasVigesimaSeptima = doc.splitTextToSize(textoVigesimaSeptima, pageWidth);
    doc.text(lineasVigesimaSeptima, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima.length * lineSpacing + 5;

    const textoVigesimaSeptima2 = "En el caso en que EL VEHÍCULO requiera de alguna reparación adicional durante la vigencia del presente contrato, EL SOCIO tendrá que cotizar la reparación y ver los tiempos estimados que dure la reparación. EL SOCIO es el único que pueda mandar EL VEHÍCULO a reparación en la Agencia o Taller que llegase a autorizar EL SOCIO. Será también causa de rescisión del contrato que un tercero no autorizado por EL SOCIO revise o haga alguna reparación a EL VEHÍCULO.";
    const lineasVigesimaSeptima2 = doc.splitTextToSize(textoVigesimaSeptima2, pageWidth);
    doc.text(lineasVigesimaSeptima2, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima2.length * lineSpacing + 5;

    const textoVigesimaSeptima3 = "EL CONDUCTOR acuerda que, en caso de alguna falla del VEHÍCULO, tiene que reportarlo inmediatamente a EL SOCIO, para que el VEHÍCULO sea trasladado a la Agencia o Taller correspondiente.";
    const lineasVigesimaSeptima3 = doc.splitTextToSize(textoVigesimaSeptima3, pageWidth);
    doc.text(lineasVigesimaSeptima3, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima3.length * lineSpacing + 5;

    const textoVigesimaSeptima4 = "Si el coche quedará inhabilitado para cumplir con las funciones propias del NEGOCIO, derivado de la falta de mantenimiento por parte del SOCIO, éste quedará exento de pago alguno por concepto de renta.";
    const lineasVigesimaSeptima4 = doc.splitTextToSize(textoVigesimaSeptima4, pageWidth);
    doc.text(lineasVigesimaSeptima4, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima4.length * lineSpacing + 5;

    const textoVigesimaSeptima5 = "En el caso de que el coche quedará inhabilitado a causa del CONDUCTOR este conviene pagar la cantidad de $1,500.00, MIL QUINIENTOS PESOS. Forma semanal al SOCIO. En el caso de que la inhabilitación se debiera a un TERCERO el CONDUCTOR deberá tomar este tiempo como descanso asumiendo las pérdidas derivadas de la inactividad del NEGOCIO.";
    const lineasVigesimaSeptima5 = doc.splitTextToSize(textoVigesimaSeptima5, pageWidth);
    doc.text(lineasVigesimaSeptima5, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima5.length * lineSpacing + 5;

    const textoVigesimaSeptima6 = "Todos los gastos relacionados con el Mantenimiento Correctivo del Vehículo serán cubiertos por EL SOCIO, a reserva de que el diagnóstico emitido por la Agencia, indique que la falla se derive de daño, negligencia o mal uso por parte de EL CONDUCTOR, en cuyo caso éste será responsable del 100% (cien por ciento) del pago referido.";
    const lineasVigesimaSeptima6 = doc.splitTextToSize(textoVigesimaSeptima6, pageWidth);
    doc.text(lineasVigesimaSeptima6, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima6.length * lineSpacing + 5;

    const textoVigesimaSeptima7 = "En el caso de un accidente donde el seguro dictamine, se derivó de la negligencia, falta de pericia o cualquier otra causa que fuera responsabilidad del conductor, el CONDUCTOR se hará cargo del 100% del deducible del auto, no pudiendo ser reparado en ningún otro lugar que no sea el señalado por EL SOCIO.";
    const lineasVigesimaSeptima7 = doc.splitTextToSize(textoVigesimaSeptima7, pageWidth);
    doc.text(lineasVigesimaSeptima7, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima7.length * lineSpacing + 5;

    const textoVigesimaSeptima8 = "EL CONDUCTOR acuerda que en caso de no cumplir con lo establecido en esta Cláusula y se vea dañado el VEHÍCULO, será causa de rescisión del contrato y éste deberá de pagar por los daños y perjuicios generados.";
    const lineasVigesimaSeptima8 = doc.splitTextToSize(textoVigesimaSeptima8, pageWidth);
    doc.text(lineasVigesimaSeptima8, 10, posY + lineSpacing);
    posY += lineasVigesimaSeptima8.length * lineSpacing + 10;

    // Vigésima Octava Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA OCTAVA: DISPOSICIÓN DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesimaOctava = "Durante la vigencia del presente contrato, LAS PARTES acuerdan que EL VEHÍCULO estará a disposición de EL CONDUCTOR, a no ser que EL VEHÍCULO sea requerido por EL SOCIO en los casos de mantenimiento, inspección, percances, o cualquier otro establecido en el presente instrumento.";
    const lineasVigesimaOctava = doc.splitTextToSize(textoVigesimaOctava, pageWidth);
    doc.text(lineasVigesimaOctava, 10, posY + lineSpacing);
    posY += lineasVigesimaOctava.length * lineSpacing + 5;

    const textoVigesimaOctava2 = "Así mismo, EL CONDUCTOR se compromete a que cada vez que no esté usando el VEHÍCULO para el desempeño de LOS SERVICIOS relacionados con EL NEGOCIO, resguardará el VEHÍCULO en el garaje de su domicilio, señalado en la Declaración II.3 de este instrumento. En caso de incumplimiento a lo establecido en esta Cláusula, será causa de rescisión inmediata del Contrato, pudiendo EL SOCIO proceder a lo establecido en el presente instrumento.";
    const lineasVigesimaOctava2 = doc.splitTextToSize(textoVigesimaOctava2, pageWidth);
    doc.text(lineasVigesimaOctava2, 10, posY + lineSpacing);

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

export default GenerarP10;
