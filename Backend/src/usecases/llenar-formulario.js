import puppeteer from 'puppeteer'
import { getAdress, delay, decideDocument} from  '../utils/index.js';

export const llenarFormulario = async (url,{
    documentoIdentidad,
    nass,
    idOcupacion,
    genero,
    fechaNacimiento,
    idPais,
    nombres,
    apellidos,
    diversidadFuncional,
    victimaTerroismo,
    violenciaGenero,
    direccion,
    codigoPostal,
    telefono,
    correo,
    requisitoAcceso,
    procedencia,
    idInteres,
    estudios,
    categoria,
    afectadoErto,
    afectadoEro,
    difucion,
    imagen,
    razonSocialEmpresa,
    numeroSeguridadSocial,
    medidaEmpresa,
    cifEmpresa,
    direcionEmpresa,
    codigoPostalEmpresa,
    desocupado,
}) => {
    // //Puppetter
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1500,
            height: 768
        }
    });


    const page = await browser.newPage();

    await page.goto('https://gestio.conforcat.extranet.gencat.cat/Account/LogOn')
    await page.waitForSelector('#userName');
    await page.type('#userName', 'mar_sanz');
    await page.waitForSelector('#password');
    await page.type('#password', 'MRLE.0609_2425');
    await page.click('#btnLogin')
    await delay(500);
    await page.goto(url);

    await page.waitForSelector('#TipusDocument');
    await page.select('#TipusDocument', decideDocument(documentoIdentidad).toString().trim())
    await page.waitForSelector('#NIF');
    await page.type('#NIF', documentoIdentidad);
    await page.waitForSelector('#NASS');
    await page.type('#NASS', nass || "");
    if (desocupado) {
        //console.log('desocupado', desocupado);
        await page.waitForSelector('#LstColectiu');
        await page.select('#LstColectiu', '17')
    } else {
        await page.waitForSelector('#LstColectiu');
        await page.select('#LstColectiu', idOcupacion)

        await page.waitForSelector('#EmpresaRaoSocial');
        await page.type('#EmpresaRaoSocial', razonSocialEmpresa);
        await page.waitForSelector('#EmpresaNumIncripcioSS');
        await page.type('#EmpresaNumIncripcioSS', numeroSeguridadSocial);
        await page.waitForSelector('#EmpresaCIF');
        await page.type('#EmpresaCIF', cifEmpresa);
        await page.waitForSelector('#EmpresaCP');
        await page.type('#EmpresaCP', codigoPostalEmpresa);
        await page.waitForSelector('#EmpresaAdreca');
        await page.type('#EmpresaAdreca', direcionEmpresa);
        await page.waitForSelector('#MidaEmpresa');
        await page.select('#MidaEmpresa', medidaEmpresa);
    }

    await page.waitForSelector('#genere');
    await page.select('#genere', genero);
    await page.waitForSelector('#DataNaixement');
    await page.type('#DataNaixement', fechaNacimiento);
    await page.waitForSelector('#IdPais');
    await page.select('#IdPais', idPais);
    await page.waitForSelector('#Nom');
    await page.type('#Nom', nombres);
    await page.waitForSelector('#Cognoms');
    await page.type('#Cognoms', apellidos);


    if (diversidadFuncional) {
        await page.click('input[value="True"]');
    }
    else {
        await page.click('input[value="False"]');
    }

    if (victimaTerroismo) {
        await page.click('#Terrorisme[value="True"]');
    }
    else {
        await page.click('#Terrorisme[value="False"]');
    }

    if (violenciaGenero) {
        await page.click('#Violencia_Genere[value="True"]');
    }
    else {
        await page.click('#Violencia_Genere[value="False"]');
    }
    //---------------------------------------------------------------------//----------------------------------------------//

    try {
        await getAdress(direccion, page);
    } catch (error) {
        return error.message;
    }
    await page.waitForSelector('#CP');
    await page.type('#CP', codigoPostal);
    await page.waitForSelector('#CodiMunicipi');
    await page.focus('#CodiMunicipi');

    await delay(500);
    const popUpOpen = await page.evaluate(() => {
        const popUp = document.querySelector('#popup');
        return popUp ? window.getComputedStyle(popUp).display !== 'none' : false;
    })

    if (popUpOpen) {
        await delay(8000);
    }

    await page.waitForSelector('#Telefon1');
    await page.type('#Telefon1', telefono);
    await page.waitForSelector('#EMail');
    await page.type('#EMail', correo);
    if (requisitoAcceso !== '0') {
        await page.waitForSelector('#RequisitsAcces');
        await page.select('#RequisitsAcces', requisitoAcceso);
    }
    await page.waitForSelector('#ComEsHasConegut');
    await page.select('#ComEsHasConegut', procedencia);
    await page.waitForSelector('#InteresaParticipar');
    await page.select('#InteresaParticipar', idInteres);

    //-------------------------------------------------///---------------------------------------------//

    await page.click('input[name="est"][value="' + estudios + '"]');
    try {
        await page.click('input[name="Categoria"][value="' + categoria.id + '"]');
    } catch (error) {
        if (error.message.match(/No\s+element\s+found\s+for\s+selector/));
        {
            try {
                await page.click('input[name="Categoria"][value="' + categoria.id3 + '"]');

            } catch (error) {
                if (error.message.match(/No\s+element\s+found\s+for\s+selector/)) {
                    await page.click('input[name="Categoria"][value="' + categoria.id2 + '"]');
                } else {
                    return error.message;
                }
            }
        }

    }


    ///-----------------------------------------------//----------------------------------------------//

    if (difucion) {
        await page.click('#DifusioSi[value="True"]');
    } else {
        await page.click('#DifusioNo[value="False"]');
    }

    if (imagen) {
        await page.click('#ImatgeVeuSi[value="True"]');
    }
    else {
        await page.click('#ImatgeVeuNo[value="False"]');
    }
    if (afectadoErto) {
        await page.click('#Erto[value="True"]');
    }
    else {
        await page.click('#Erto[value="False"]');
    }
    if (afectadoEro) {
        await page.click('#EroSi[value="True"]');
    }
    else {
        await page.click('#EroNo[value="False"]');
    }

    //await page.click('#DemanantNo[value="False"]');
    //------------------------------------------------------//-------------------------------------------------------//

    await page.waitForSelector('#geoloc');
    await page.click('#geoloc');

    page.on('dialog', async dialog => { // Imprime el mensaje del alert
        await dialog.accept();
    });
    // await delay(600);
    // await page.waitForSelector('[bloquejar="remoure"]');
    // await page.click('[bloquejar="remoure"]');
    // await delay(10000);
    // page.close();
    // browser.close();
    // return "OK";
}

