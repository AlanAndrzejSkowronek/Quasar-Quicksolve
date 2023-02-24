<template>
    <div class="flex window-height justify-center items-center q-pa-md">
        <q-table
        title="Usuarios"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :grid="$q.screen.lt.lg"
        :loading="loading"
        loading-label="Cargando los resultados..."
        :filter="filter"
        no-data-label="No se han podido encontrar resultados..."
        >
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar...">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
            <template v-slot:body-cell-ACCIONES="props">
                <q-td :props="props">
                    <q-btn :to="'/incidencia/' + props.row.ID" round color="primary" glossy icon="edit"/>
                </q-td>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                <q-card>
                    <q-card-section>
                        <strong class="q-pr-sm">{{ props.row.TITULO }}</strong>
                        <q-btn :to="'/incidencia/' + props.row.ID" round color="primary" glossy icon="edit" :size="12"/>
                    </q-card-section>
                    <q-separator />
                    <q-list>
                    <template v-for="r in props.cols">
                    <q-item v-if="r.label != 'Título' && r.label != 'ID' && r.label != 'Acciones'" :key="r.name" v-ripple>
                        <q-item-section>
                            <q-item-label><strong>{{ r.label }}</strong></q-item-label>
                            <q-item-label>{{ r.value }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    </template>
                    </q-list>
                </q-card>
                </div>
            </template>
        </q-table>
    </div>
    
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { api } from 'boot/axios'
    import { linkLaravel } from 'src/other/Utils'

    const comprobarUsuario = (user, email) => {
        return user ? construirNombreUser(user) : email 
    }

    const construirNombreUser = (user) => {
        if (user) return user.user_data.name + " " + user.user_data.first_surname + " " + user.user_data.second_surname 
        else return "N/A"
    }

    onMounted(async () => {
        let incidences = await api.get(linkLaravel + "/incidences")
        rows.value = incidences.data.map(r =>{
            return {
                ID: r.id,
                TITULO: r.title,
                DESCRIPCION: r.description,
                FECHA_INICIO: r.date_start,
                FECHA_FINAL: r.date_end ? r.date_end : "N/A",
                ESPACIO: r.space ? r.space.name : "N/A",
                DEPARTAMENTO: r.department ? r.department.name : "N/A",
                USUARIO: comprobarUsuario(r.user, r.email),
                TECH: construirNombreUser(r.tech),
                ESTADO: r.incidenceState.status_name
            }
        })
        loading.value = false
    })
    
    let filter = ref('')
    let loading = ref(true)
    let rows = ref([])
    let columns = [
        { name: 'ID', label: 'ID', field: 'ID', required: true, sortable: true, align: 'left' },
        { name: 'TITULO', label: 'Título', field: 'TITULO', required: true, sortable: true, align: 'left'},
        { name: 'DESCRIPCION', label: 'Descripción', field: 'DESCRIPCION', required: true, sortable: true, align: 'left', style: 'max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' },
        { name: 'FECHA_INICIO', label: 'Fecha de inicio', field: 'FECHA_INICIO', required: true, sortable: true, align: 'left' },
        { name: 'FECHA_FINAL', label: 'Fecha final', field: 'FECHA_FINAL', required: true, sortable: true, align: 'left' },
        { name: 'ESPACIO', label: 'Espacio', field: 'ESPACIO', required: true, sortable: true, align: 'left' },
        { name: 'DEPARTAMENTO', label: 'Departamento', field: 'DEPARTAMENTO', required: true, sortable: true, align: 'left' },
        { name: 'USUARIO', label: 'Usuario', field: 'USUARIO', required: true, sortable: true, align: 'left' },
        { name: 'TECH', label: 'Técnico', field: 'TECH', required: true, sortable: true, align: 'left' },
        { name: 'ESTADO', label: 'Estado', field: 'ESTADO', required: true, sortable: true, align: 'left' },
        { name: 'ACCIONES', label: 'Acciones', field: 'ACCIONES', required: true, sortable: true, align: 'center' }
    ]
</script>