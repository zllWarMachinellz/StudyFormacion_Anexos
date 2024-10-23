

import { extraerInformacionPdf, llenarFormulario } from '../../usecases/index.js';

/**
 * 
 * @param {String} url 
 * @param {File} file 
 * @param {String} accesTipe 
 * @returns {Promise<String>}
 */
export const conforcatController = async (url, file, accesTipe) => {
    const informacion = await extraerInformacionPdf(file.buffer, accesTipe);
    console.log(informacion);
    const result = await llenarFormulario(url, informacion);

    return result;
}
