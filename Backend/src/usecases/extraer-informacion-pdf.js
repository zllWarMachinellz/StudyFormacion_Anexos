
import { baseCategorias, baseEstudios, baseMedidaEmpresa, generos, intereses, ocupaciones, paises, procedencias } from '../models/index.js' 
import {extractTextPdf} from '../utils/index.js'

/**
 * @param {File} pdf 
 * @param {String} url 
 * @param {String} accesTipe 
 * @returns {Promise<String>}
 */
export async function extraerInformacionPdf(pdf, accesTipe) {
  const PDFFields = await extractTextPdf(pdf);

  const [{ value: consigna }] = PDFFields.filter((field) => { return field.names === 'Consigna' });
  const [{ value: desocupado }] = PDFFields.filter((field) => { return field.names === 'Desocupatada' });
  //console.log(desocupado);
  const [{ value: documentdidentitat }] = PDFFields.filter((field) => { return field.names === "Document d'identitat" });
  const [{ value: nomParticipant }] = PDFFields.filter((field) => { return field.names === "Nom participant" });
  const [{ value: congnomsParticipant }] = PDFFields.filter((field) => { return field.names === "Cognoms participant" });
  const [{ value: dataDeNaixament }] = PDFFields.filter((field) => { return field.names === "Data de naixament" });
  const [{ value: nass }] = PDFFields.filter((field) => { return field.names === "NASS" });
  const [{ value: paisa }] = PDFFields.filter((field) => { return field.names === "País d'origen" });
  const [{ id: paisId }] = paises.filter(pais => {
    if (pais.valuec === paisa.trim())
      return pais.valuec === paisa.trim();
    else if (pais.value === paisa.trim())
      return pais.value === paisa.trim()
  });
  const [{ value: genere }] = PDFFields.filter(field => { return field.names === "Gènere" });
  const [{ value: divFuncional }] = PDFFields.filter(field => { return field.names === "Diversitat funcional" });
  const [{ value: terrorisme }] = PDFFields.filter(field => { return field.names === "Víctima de terrorisme" });
  const [{ value: genViolence }] = PDFFields.filter(field => { return field.names === "Violència de gènere" });
  const [{ id: genereId }] = generos.filter(gen => {
    if (gen.value === genere[0]) {
      return gen.value === genere[0];
    }
    return gen.valuec === genere[0];
  });
  const [{ value: direccion }] = PDFFields.filter(field => { return field.names === "Adreça participant" });
  const [{ value: codigoPostal }] = PDFFields.filter(field => {
    if (field.names === "Codi postal participant") {
      return field.names === "Codi postal participant";
    }
    return field.names === "Codi postal particiapnt"
  });
  const [{ value: telefono }] = PDFFields.filter(field => { return field.names === "Telèfon" });
  const [{ value: correo }] = PDFFields.filter(field => { return field.names === "Correu electrònic participant" });
  const [{ value: estudios }] = PDFFields.filter(field => { return field.names === "Estudis" });
  const [{ value: categoriaProf }] = PDFFields.filter(field => { return field.names === "Categoria professional (només persones ocuapdes)" });
  const [{ value: razonSocialEmp }] = PDFFields.filter(field => { return field.names === "Rao social" });
  const [{ value: empresaCIF }] = PDFFields.filter(field => { return field.names === "CIF_empresa" });
  const [{ value: seguridadSocialEmpresa }] = PDFFields.filter(field => { return field.names === "Núm. d’inscripció a la Seguretat Social" });
  const [{ value: direccionEmpresa }] = PDFFields.filter(field => { return field.names === "Adreça del centre de treball" });
  const [{ value: empresaCP }] = PDFFields.filter(field => { return field.names === "Codi postal empresa" });
  const [{ value: medidaEmpresa }] = PDFFields.filter(field => { return field.names === "Mida de l'empresa" });
  const procedencia = PDFFields.filter(field => {
    return (field.names === "Oficina de Treball" || field.names === "Web del Consorci conforcatgencatcat" ||
      field.names === "Cercador de cursos del SOC" || field.names === "Web fpgencatcat" || field.names === "Twitter (X) del Consorci @fpo_continua" ||
      field.names === "Twitter (X) d'Ocupació @ocupaciocat" || field.names === "Entitat de formació" || field.names === "LinkedIn" ||
      field.names === "Amics, amigues o familiars" || field.names === "Premsa, ràdio, televisió (mitjans comunicació)" || field.names === "Empresa" ||
      field.names === "Agents econòmics i socials" || field.names === "Altres." || field.names === "Projectat orientació professional" ||
      field.names === "Altres. Quins?" || field.names === "Altres"
    );
  });
  //console.log(procedencia);
  const [{ value: interes }] = PDFFields.filter(field => {
    if (field.names === "Interés en participar en esta acción formativa") {
      return field.names === "Interés en participar en esta acción formativa"
    }
    return field.names === "Interès a participar a l'acció formativa"
  });
  //console.log(interes);

  const [{ id: interesTransforms }] = intereses.filter(inter => {
    if (inter.valuec === interes[0]) {
      return inter.valuec === interes[0];
    }
    return inter.value === interes[0];
  });
  //console.log(interesTransforms);
  const procTransform = procedencia.filter(proce => { return proce.value === true });
  //console.log(procTransform);
  const [{ id: procId }] = procedencias.filter(proc => {
    if (proc.value == procTransform[0].names)
      return proc.value == procTransform[0].names
    else if (proc.valueb == procTransform[0].names)
      return proc.valueb == procTransform[0].names
    else
      return proc.valueb == procTransform[0].names
  });
  let consignaTransform = 0;
  if (consigna[0] !== '-') {
    [{ id: consignaTransform }] = ocupaciones.filter(ocupacion => { return ocupacion.value === consigna[0] })
  }
  const [{ id: estudiosTransform }] = baseEstudios.filter(studio => {
    if (studio.value === estudios[0]) {
      return studio.value === estudios[0]
    }
    return studio.valuec === estudios[0]
  });

  const [categoriaProfesional] = baseCategorias.filter(categoria => {
    if (categoria.valueb === categoriaProf[0]) {
      return categoria.valueb === categoriaProf[0];
    }
    else if (categoria.valuec === categoriaProf[0])
      return categoria.valuec === categoriaProf[0]
    else
      return categoria.value === categoriaProf[0]

  });

  const [{ id: medidaEmpresaTransform }] = baseMedidaEmpresa.filter(medidaEmp => {
    if (medidaEmp.valuec === medidaEmpresa[0]) {
      return medidaEmp.valuec === medidaEmpresa[0];
    }
    return medidaEmp.value === medidaEmpresa[0];
  });
  const [{ value: difucion }] = PDFFields.filter(element => { return element.names === 'Autoritzo al Consorci per a la Formació Contínua de Catalunya a utilitzar les meves dades personals per rebre informació sobre la formació professional per a l’ocupació' });
  const [{ value: derechoImagen }] = PDFFields.filter(element => { return element.names === 'Autoritzo al Consorci per a la Formació Contínua de Catalunya a que la meva imatge/veu pugui sortir en fotografies i/o vídeos publicats a la seva web i/o a les seves xarxes socials' });
  const [{ value: afectadoErto }] = PDFFields.filter(element => { return element.names === 'Afectatada ERTO' });
  const [{ value: afectadoEro }] = PDFFields.filter(element => { return element.names === 'Afectatada ERO' });

  return {
    documentoIdentidad: documentdidentitat,
    nass: nass,
    codigoOcupacion: consignaTransform,
    genero: genereId,
    fechaNacimiento: dataDeNaixament,
    idPais: paisId,
    nombres: nomParticipant,
    apellidos: congnomsParticipant,
    diversidadFuncional: divFuncional,
    victimaTerroismo: terrorisme,
    violenciaGenero: genViolence,
    direccion: direccion,
    codigoPostal: codigoPostal,
    telefono: telefono,
    correo: correo,
    requisitoAcceso: accesTipe,
    procedencia: procId,
    idInteres: interesTransforms,
    estudios: estudiosTransform,
    categoria: categoriaProfesional,
    desocupado: desocupado,
    idOcupacion: consignaTransform,
    afectadoErto: afectadoErto,
    afectadoEro: afectadoEro,
    difucion: difucion,
    imagen: derechoImagen,
    razonSocialEmpresa: razonSocialEmp,
    numeroSeguridadSocial: seguridadSocialEmpresa,
    medidaEmpresa: medidaEmpresaTransform,
    cifEmpresa: empresaCIF,
    direcionEmpresa: direccionEmpresa,
    codigoPostalEmpresa: empresaCP
  }

}
