import { api } from "src/boot/axios"
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

export const linkSpring = process.env.TOKEN_URL
export const linkLaravel = process.env.API_URL

export const translator = async (texts, langs) => {
    let langsFiltered = langs.filter(el => el.lang !== "es" )
    console.log(langs);
    let proms = []
    texts.forEach(t => {
        langsFiltered.forEach(l => {
            proms.push(translateApi(l.lang, t))
        })
    })
    let promises = Promise.all(proms)
    let arrObjs = await promises
    return arrObjs;
}

export const translateApi = async (to, text) => {    
    let jsonTranslate = {
        languageFrom: "es",
        languageTo: to,
        text: text
    }
    return { [to]: (await api.post("https://theteacher.codiblau.com/piano/nologin/google/translate", jsonTranslate)).data }
}

export const getLangs = async () => {
    return await api.get(linkLaravel + "/lenguajes")
}


export const generatePdf = (start,end) => {

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
        compress: true,
    });
    const table = document.querySelector("table")
    table.querySelectorAll("th").forEach(th => {
        th.innerHTML = th.innerHTML.replace(/<i.*<\/i>/, "")
    })
    const date = new Date()

    const dia = date.getDate().toString().padStart(2, '0')
    const mes = (date.getMonth() + 1).toString().padStart(2, '0')
    const anio = date.getFullYear()
    doc.text("Informe de Incidencias resueltas " + dia + "/" + mes + "/" + anio, 10, 20)
    
    doc.text("Fecha de inicio: " + start + "\n", 10, 40)
    doc.text("Fecha de fin: " + end, 10, 60)


    autoTable(doc,{
        startY: 80,
        html: table,
        theme: 'grid',
    });

    doc.save("Informe_Incidencias_" + start + ".pdf")
}