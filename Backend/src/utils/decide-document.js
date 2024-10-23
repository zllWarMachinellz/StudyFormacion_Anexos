export function decideDocument(document) {
    if (document.length > 9) {
      return false;
    }
  
    let regex = /^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (regex.test(document)) {
      return 2
    }
  
    regex = /^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    // Comprobar formato
    if (regex.test(document)) {
      return 1
    }
  
    return 4
  }
