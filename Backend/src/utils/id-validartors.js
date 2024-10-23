const { documento } = require('../models/models.js');

class IdValidators {
    documento
    documentoIdentidad

    /**
     * 
     * @param {String} documento 
     */
    constructor(documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
        this.documento = documento;
    }

    extraerNumerosDni() {
        return parseInt(this.documentoIdentidad.substring(0, this.documentoIdentidad.length - 1));
    }

    validarDni() {
        const numerosDocumento = this.extraerNumerosDni();
        const resto = numerosDocumento % 23;
        const letra = documento.filter(elemento =>{
            return elemento.id === resto;
        })
        //if(this.documentoIdentidad.substring(this.documentoIdentidad.length) ===)
    }


}