<template>
   <h4 class="q-ma-md q-my-xl text-left">Generar Informes</h4>
        <q-form @submit="onSubmit" class="row q-mx-auto justify-center q-my-xl">
        <div class="q-ma-md q-mx-md col-md-2 col-11">
            Inicio
            <q-input 
                v-model="date_start"  
                filled type="date" 
                :max="maxDate" />
        </div>

        <div class="q-ma-md col-md-2 col-11">
            Final
            <q-input 
             v-model="date_end"
             filled type="date" 
             :max="maxDate" 
             :min="date_start"
             :disable="date_start === ''"
             />
        </div>

        <div class="q-ma-md col-md-2 col-11">
            Departamento
            <q-select 
                :loading="loadingSelect" 
                filled 
                v-model="department" 
                label="Departamento" 
                :options="department_options"/>
        </div>

        <div class="q-ma-md col-md-2 col-11 self-center justify-center">
            <div>&nbsp;</div>
        <q-btn 
        :style="{width:'100%'}"
            size="1.1rem" 
            label="Buscar" 
            color="primary" 
            type="submit" />
        </div>
        </q-form>

    <div class="flex justify-center items-center">
        <q-table 
            :rows="rows" 
            :title="'Incidencias Resuletas'" 
            :columns="columns" 
            row-key="name" 
            :loading="loading"
            style="width: 80%;" 
            :no-data-label="noDataLabel" 
            :filter="filter"
            loading-label="Cargando los resultados..." 
            :grid="$q.screen.lt.lg" 
            id="#incidences-table">
            <template v-slot:top-right>
                <q-input borderless dense debounce="400" v-model="filter" placeholder="Buscar...">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </div>

    <div class="flex justify-center" v-if="canGeneratePdf">
        <q-btn size="1.2rem"  class="q-my-lg" label="Generar PDF" color="primary" @click="generateReport" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { linkLaravel } from 'src/other/Utils'
import { generatePdf } from 'src/other/Utils';

const $q = useQuasar()

let canGeneratePdf = ref(false)
let date_start = ref('')
let date_end = ref('')
let loading = ref(false)
let loadingSelect = ref(true)
let department = ref('')
let noDataLabel = ref('No se ha realizado ninguna búsqueda')
let department_options = ref([])
const departmentsLoaded = ref([])
const maxDate = new Date().toISOString().split('T')[0]

onMounted(async () => {
    const { data } = await api.get(linkLaravel + '/departments')
    department_options.value.push('Todos')
    department.value = 'Todos'
    data.map(element => department_options.value.push(element.name))
    departmentsLoaded.value = data
    loadingSelect.value = false
});


const searchIncidences = async () => {

    loading.value = true
    let id = department.value === 'Todos' ? null : departmentsLoaded.value.find(d => d.name === department.value).id
    let date_start_formated = date_start.value.split('-').reverse().join('-')
    let date_end_formated = date_end.value.split('-').reverse().join('-')

    const { data } = await api.post(linkLaravel + '/incidences/filter/', {
        start: date_start_formated,
        end: date_end_formated,
        department_id: id
    });

    if (data.length > 0) {
        canGeneratePdf.value = true
        loading.value = false
    }else{
        loading.value = false
        noDataLabel.value = 'No se encontraron resultados'
        $q.notify({
            message: 'No se encontraron resultados',
            color: 'negative',
            position: 'bottom-right',
            timeout: 2000
        })
    }

    rows.value = data.map(r => {
        return {
            ID: r.id,
            TITULO: r.title,
            DESCRIPCION: r.description,
            FECHA_INICIO: r.date_start,
            FECHA_FINAL: r.date_end ? r.date_end : "N/A",
            DURACION: r.date_end !== "N/A" ? r.date_period + ' Días' : "N/A",
            ESPACIO: r.space ? r.space.name : "N/A",
            DEPARTAMENTO: r.department ? r.department.name : "N/A",
            USUARIO: r.user ? r.user.username : "N/A",
            TECH: r.tech ? r.tech.username : "N/A",
            ESTADO: r.incidenceState.status_name
        }
    })
}


const onSubmit = () => {
    if (date_start.value === '' || date_end.value === '') {
        $q.notify({
            message: 'Debe seleccionar una fecha de inicio y una fecha final',
            color: 'negative',
            position: 'bottom-right',
            timeout: 2000
        })
    } else {
        searchIncidences()
    }
}

let filter = ref('')
let rows = ref([])
let columns = [
    { name: 'ID', label: 'ID', field: 'ID', required: true, sortable: true, align: 'left' },
    { name: 'TITULO', label: 'Título', field: 'TITULO', required: true, sortable: true, align: 'left' },
    { name: 'FECHA_INICIO', label: 'Fecha de inicio', field: 'FECHA_INICIO', required: true, sortable: true, align: 'left' },
    { name: 'FECHA_FINAL', label: 'Fecha final', field: 'FECHA_FINAL', required: true, sortable: true, align: 'left' },
    { name: 'DURACION', label: 'Duración', field: 'DURACION', required: true, sortable: true, align: 'left' },
    { name: 'ESPACIO', label: 'Espacio', field: 'ESPACIO', required: true, sortable: true, align: 'left' },
    { name: 'DEPARTAMENTO', label: 'Departamento', field: 'DEPARTAMENTO', required: true, sortable: true, align: 'left' },
    { name: 'USUARIO', label: 'Usuario', field: 'USUARIO', required: true, sortable: true, align: 'left' },
    { name: 'TECH', label: 'Técnico', field: 'TECH', required: true, sortable: true, align: 'left' },
]

const generateReport = () => {
    generatePdf(date_start.value, date_end.value)
}
</script>