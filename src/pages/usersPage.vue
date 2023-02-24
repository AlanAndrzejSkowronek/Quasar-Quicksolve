<template>
    <div class="flex window-height justify-center items-center q-pa-md">
        <q-table
        title="Incidencias"
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
                    <q-btn :to="'/usuario/' + props.row.ID" round color="primary" glossy icon="edit"/>
                </q-td>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                <q-card>
                    <q-card-section>
                        <strong class="q-pr-sm">{{ props.row.NOMBRE_USUARIO }}</strong>
                        <q-btn :to="'/usuario/' + props.row.ID" round color="primary" glossy icon="edit" :size="12"/>
                    </q-card-section>
                    <q-separator />
                    <q-list>
                    <template v-for="r in props.cols">
                    <q-item v-if="r.label != 'Nombre de usuario' && r.label != 'ID' && r.label != 'Acciones'" :key="r.name" v-ripple>
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

    const construirNombreUser = (user) => {
        return user.user_data.name + " " + user.user_data.first_surname + " " + user.user_data.second_surname 
    }

    const construirFecha = (date) => {
        let d = new Date(date), day = '' + d.getDate(), month = '' + (d.getMonth() + 1)

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [day, month, d.getFullYear()].join('/') + " " + d.getHours() + ":" + d.getMinutes()
    }

    onMounted(async () => {
        let users = await api.get(linkLaravel + "/users")
        rows.value = users.data.map(r =>{
            return {
                ID: r.id,
                NOMBRE_USUARIO: r.username,
                EMAIL: r.email,
                TIPO: r.type,
                NOMBRE_COMPLETO: construirNombreUser(r),
                CREADO_EN: construirFecha(r.user_data.created),
                DEPARTAMENTO: r.department ? r.department.name : "N/A",
                SERVICIO: r.service ? r.service + " " + r.expiration_date : "N/A"
            }
        })
        loading.value = false
    })
    
    let filter = ref('')
    let loading = ref(true)
    let rows = ref([])
    let columns = [
        { name: 'ID', label: 'ID', field: 'ID', required: true, sortable: true, align: 'left' },
        { name: 'NOMBRE_USUARIO', label: 'Nombre de usuario', field: 'NOMBRE_USUARIO', required: true, sortable: true, align: 'left'},
        { name: 'EMAIL', label: 'Email', field: 'EMAIL', required: true, sortable: true, align: 'left' },
        { name: 'TIPO', label: 'Rol', field: 'TIPO', required: true, sortable: true, align: 'left' },
        { name: 'NOMBRE_COMPLETO', label: 'Nombre completo', field: 'NOMBRE_COMPLETO', required: true, sortable: true, align: 'left' },
        { name: 'CREADO_EN', label: 'Creado en', field: 'CREADO_EN', required: true, sortable: true, align: 'left' },
        { name: 'DEPARTAMENTO', label: 'Departamento', field: 'DEPARTAMENTO', required: true, sortable: true, align: 'left' },
        { name: 'SERVICIO', label: 'Serivicio y expiración', field: 'SERVICIO', required: true, sortable: true, align: 'left' },  
        { name: 'ACCIONES', label: 'Acciones', field: 'ACCIONES', required: true, sortable: true, align: 'center' }  
    ]
</script>