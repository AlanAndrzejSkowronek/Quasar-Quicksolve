import { api } from "src/boot/axios"

export const linkSpring = "http://localhost:8080"
export const linkLaravel = "http://localhost:82"

export const translator = async (texts, langs) => {
    let langsFiltered = langs.filter(el => el.lang !== "es" )
    langsFiltered.push({lang: "fr"})
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

const translateApi = async (to, text) => {
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