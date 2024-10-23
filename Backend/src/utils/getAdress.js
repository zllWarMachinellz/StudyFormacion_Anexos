const tiposVia = {
    "rambla": { id: "279", nombres: ["rambla", "rbla"] },
    "autopista": { id: "25", nombres: ["autopista", "ap"] },
    "paseo": { id: "224", nombres: ["passeig", "pg", "p.º", "ps", "paseo"] },
    "pasaje": { id: "266", nombres: ["passatge", "ptge", "pasaje", "psje"] },
    "avenida": { id: "32", nombres: ["avinguda", "av", "avd", "avda", "av.", "avenida"] },
    "calle": { id: "71", nombres: ["carrer", "c/", "c", "calle", "cl", "c."] },
    "camino": { id: "59", nombres: ["camí", "camino", "cami", "cmno"] },
    "plaza": { id: "237", nombres: ["plaça", "pl", "plz", "pla", "plaza", "pz"] },
    "carretera": { id: "119", nombres: ["carretera", "ctra", "carret"] },
    "travesía": { id: "307", nombres: ["travessera", "trv", "travesia", "tr"] },
    "ronda": { id: "286", nombres: ["ronda", "rd"] },
    "puente": { id: "245", nombres: ["pont", "puente", "pnt"] },
    "callejón": { id: "104", nombres: ["carreró", "callejón", "cjon"] },
    "cuesta": { id: "99", nombres: ["costera", "cuesta"] },
    "via": { id: "322", nombres: ["via", "vía", "v"] },
    "polígono": { id: "244", nombres: ["polígon", "polígono", "pol"] },
    "urbanización": { id: "313", nombres: ["urbanització", "urb", "urbanización"] }
};

function getNumeroPiso(piso) {
    console.log(piso.match(/^\d+/) && piso.match(/^[Pp]/) || piso.match(/[rRdt]+$/));
    if (!piso.match(/^\d+/) && piso.match(/^[Pp]/) || piso.match(/[rRdt]+$/)) {
        const pisoNumber = [];
        const concat = (a, b) => `${a}${b}`
        const newArray = piso.split('');
        console.log(newArray);
        console.log(newArray);
        newArray.forEach(element => {
            if (!isNaN(element)) {
                pisoNumber.push(element);
            }
        });
        return pisoNumber.reduce(concat);
    }

    return piso;
}

function getRoadName(arrAdress) {
    let i = 1;
    let NombreVia = "";

    while (!arrAdress[i].match(/^\d+/) && arrAdress[i].toLowerCase() !== 'km' && arrAdress[i].toLowerCase() !== 'kilometro' && arrAdress[i].toLowerCase() !== 'nº' && arrAdress[i].toLowerCase() !== 'n.' && arrAdress[i].toLowerCase() !== '#' && arrAdress[i].toLowerCase() !== '#.' && arrAdress[i].toLowerCase() !== 'nro' && arrAdress[i].toLowerCase() !== 'no') {
        NombreVia += (arrAdress.slice(i - 1, i++));
        NombreVia += " ";
    }
    NombreVia += arrAdress[i - 1];
    return NombreVia;
}

function getRoadType(tipoVia) {
    for (let tipo in tiposVia) {
        if (tiposVia[tipo].nombres.includes(tipoVia)) {
            return tiposVia[tipo].id;
        }
    }
    return 0;
}

export async function getAdress(adress, page) {

    const adressTransform = adress.trim().split(" ");

    const tipoVia = adressTransform[0].toLowerCase();
    await page.waitForSelector('#IDTIPUSVIA');
    await page.select('#IDTIPUSVIA', getRoadType(tipoVia));
    adressTransform.shift();

    await page.waitForSelector('#Adreca');
    await page.type('#Adreca', getRoadName(adressTransform));

    while (!adressTransform[0].match(/^\d+/) && adressTransform[0].toLowerCase() !== 'km' && adressTransform[0].toLowerCase() !== 'kilometro') {
        adressTransform.shift();
    }

    console.log(adressTransform);

    if (adressTransform.length > 1 && adressTransform[1].match(/^[A-Za-z]$/)) {
        await page.waitForSelector('#NUMERO');
        await page.type('#NUMERO', `${adressTransform[0]}${adressTransform[1]}`);
        adressTransform.shift();
    } else if (adressTransform.length > 0) {
        await page.waitForSelector('#NUMERO');
        await page.type('#NUMERO', adressTransform[0]);
        adressTransform.shift();
    }
    console.log(adressTransform);
    if (adressTransform.length !== 0) {
        console.log(adressTransform.length);
        switch (adressTransform.length) {
            case 1:
                await page.waitForSelector("#PIS");
                await page.type("#PIS", adressTransform[0]);
                adressTransform.shift();
                break;
            case 2:
                await page.waitForSelector("#PIS");
                await page.type("#PIS", getNumeroPiso(adressTransform[0]));
                adressTransform.shift();
                await page.waitForSelector("#PORTA");
                await page.type("#PORTA", adressTransform[0])
                adressTransform.shift();
                break;
            case 3:
                await page.waitForSelector("#ESCALA");
                await page.type("#ESCALA", adressTransform[0]);
                adressTransform.shift();
                await page.waitForSelector("#PIS");
                await page.type("#PIS", getNumeroPiso(adressTransform[0]));
                adressTransform.shift();
                await page.waitForSelector("#PORTA");
                await page.type("#PORTA", adressTransform[0])
                adressTransform.shift();
                break;
            default:
                throw new Error("Revisa la dirección del anexo tiene que llevar el formato [tipovía]-[nombre vía]-[número vía]-[ESCALERA]-[PISO]-[PUERTA] ejemplo: Calle Angel Guimera 10 10 F");    
        }
    }

}