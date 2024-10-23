import { PDFDocument } from 'pdf-lib';

/**
 * 
 * @param {File} anexo 
 * @returns 
 */
export async function extractTextPdf(anexo) {
    const data = await PDFDocument.load(anexo);
    const form = data.getForm();
    const fields = form.getFields();
  
    const campos = fields.map(field => {
      const type = field.constructor.name;
      const names = field.getName();
      let value;
  
      switch (type) {
        case 'PDFTextField':
          value = field.getText();
          break;
        case 'PDFDropdown':
          value = field.getSelected();
          break;
        case 'PDFCheckBox':
          value = field.isChecked();
          break;
        case 'PDFRadioGroup':
          value = field.getSelected();
          break;
        default:
          value = null;
      }
      return { names, value }
    })
    return campos;
  }
