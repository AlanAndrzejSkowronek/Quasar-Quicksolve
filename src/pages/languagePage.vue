<template>
    <h4 class="q-ma-md q-my-xl text-center">Agregar nuevo Idioma</h4>

    <div class="row q-mb-xl">

        <div class="col-12 flex justify-center items-center">
        <q-select class="selectLang q-ma-md" v-model="selectLang" filled label="Selecciona un idioma" :options="langs"
            @input="selectLang" />

        <q-btn label="Traducir" color="primary" class="q-mx-sm" @click="translate" />
    </div>

    </div>
    
</template>

<style scoped>
.selectLang {
    width: 300px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { linkLaravel, translateApi, getLangs } from 'src/other/Utils'
import languages from 'src/other/Langs.json'

const $q = useQuasar()
let fields = []
const langs = ref([])
const selectLang = ref('')

onMounted(async () => {
    $q.loading.show({
        message: 'Cargando idiomas... espere por favor'
    })
    const { data } = await api.get(linkLaravel + '/language/fields')
        .then((response) => {
            return response
        }).catch((error) => {
            $q.notify({
                message: 'Error al obtener los campos',
                color: 'negative',
                position: 'bottom-right',
                timeout: 2000
            })
        })
    fields = [data.departments, data.spaces, data.states, data.advantages, data.webpage]

    const existingLangs = (await getLangs()).data

    languages.forEach((language) => {
        if (existingLangs.some(lang => lang.lang === language.code)) return;
        langs.value.push({ label: language.name, value: language.code })
    });

    $q.loading.hide()
})


const translate = async () => {

    $q.loading.show({
        message: 'Guardando idioma... espere por favor'
    })

    const promises = [];
    const langCode = selectLang.value.value
    const toTranslate = fields.map(field => field)
    
    toTranslate.forEach((field) => {
        field.forEach((value) => {
            promises.push(translateApi(langCode, value.name))
        });
    });

    const translated = await Promise.all(promises);

    let counter = 0;
    toTranslate.forEach((element) => {
        element.forEach((element) => {
            element.name = translated[counter++][langCode];
        });
    });

    const language = await translateApi(langCode, selectLang.value.label);

    save(toTranslate,langCode,language);
}


const save = async (toTranslate,langCode,language) => {
    const [departments, spaces, states, advantages, webpage] = toTranslate;

    console.log(langCode,language[langCode]);

    const saveLanguage = await api.post(linkLaravel + '/language/save', {
        language: language[langCode].charAt(0).toUpperCase() + language[langCode].slice(1),
        code: langCode,
        translatedDeps: departments,
        translatedSpa: spaces,
        translatedSta: states,
        translatedAdv: advantages,
        fields: webpage
    }).then((response) => {
        $q.notify({
            message: 'Idioma agregado correctamente',
            color: 'positive',
            position: 'bottom-right',
            timeout: 2000
        })

        $q.loading.hide()
    }).catch((error) => {
        $q.notify({
            message: 'Error al agregar el idioma',
            color: 'negative',
            position: 'bottom-right',
            timeout: 2000
        })
        $q.loading.hide()
    });
}
</script>