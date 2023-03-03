<template>
    <h4 class="q-ma-md q-mt-xl">Generar Informes</h4>
    <div class="row q-mx-auto justify-center q-my-xl">
        <div class="q-ma-md q-mx-md col-md-2 col-11">
            Inicio
            <q-input v-model="date_start"  filled type="date" :max="maxDate" />
        </div>

        <div class="q-ma-md col-md-2 col-11">
            Final
            <q-input v-model="date_end" filled type="date" :max="maxDate" />
        </div>

        <div class="q-ma-md col-md-2 col-11">
            Departamento
            <q-select 
            :loading="loadingSelect" 
            filled v-model="department" 
            label="Departamento" 
            :options="department_options"/>
        </div>

        <div class="q-ma-md col-md-2 col-11 self-center">
            <div>&nbsp;</div>
        <q-btn size="1.1rem" label="Buscar" color="primary" glossy class="q-mx-md" @click="searchIncidences" />
        </div>
    </div>

    <div class="flex justify-center items-center">
        <q-table :rows="rows" :title="'Incidencias Resuletas'" :columns="columns" row-key="name" :loading="loading"
            style="width: 80%;" :no-data-label="noDataLabel"
            loading-label="Cargando los resultados..." :grid="$q.screen.lt.lg" id="#incidences-table">

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
        <q-btn size="1.2rem"  class="q-mt-md" label="Generar PDF" glossy color="primary" @click="generarPDF" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { linkLaravel } from 'src/other/Utils'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

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
            PERIODO: r.date_end !== "N/A" ? r.date_period + ' Días' : "N/A",
            ESPACIO: r.space ? r.space.name : "N/A",
            DEPARTAMENTO: r.department ? r.department.name : "N/A",
            USUARIO: r.user ? r.user.username : "N/A",
            TECH: r.tech ? r.tech.username : "N/A",
            ESTADO: r.incidenceState.status_name
        }
    })
}


let filter = ref('')
let rows = ref([])
let columns = [
    { name: 'ID', label: 'ID', field: 'ID', required: true, sortable: true, align: 'left' },
    { name: 'TITULO', label: 'Título', field: 'TITULO', required: true, sortable: true, align: 'left' },
    { name: 'FECHA_INICIO', label: 'Fecha de inicio', field: 'FECHA_INICIO', required: true, sortable: true, align: 'left' },
    { name: 'FECHA_FINAL', label: 'Fecha final', field: 'FECHA_FINAL', required: true, sortable: true, align: 'left' },
    { name: 'PERIODO', label: 'Periodo', field: 'PERIODO', required: true, sortable: true, align: 'left' },
    { name: 'ESPACIO', label: 'Espacio', field: 'ESPACIO', required: true, sortable: true, align: 'left' },
    { name: 'DEPARTAMENTO', label: 'Departamento', field: 'DEPARTAMENTO', required: true, sortable: true, align: 'left' },
    { name: 'USUARIO', label: 'Usuario', field: 'USUARIO', required: true, sortable: true, align: 'left' },
    { name: 'TECH', label: 'Técnico', field: 'TECH', required: true, sortable: true, align: 'left' },
]

const generarPDF = () => {

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
        compress: true,
    });
    const table = document.querySelector("table")
    const date = new Date()

    const dia = date.getDate().toString().padStart(2, '0')
    const mes = (date.getMonth() + 1).toString().padStart(2, '0')
    const anio = date.getFullYear()
    doc.text("Informe de Incidencias resueltas " + dia + "/" + mes + "/" + anio, 10, 10)

    autoTable(doc,{
        html: table,
        theme: 'grid',
    });

    doc.save("incidences.pdf")

    $q.notify({
        message: 'PDF generado correctamente',
        color: 'positive',
        position: 'bottom-right',
        timeout: 2000
    })
}
</script>