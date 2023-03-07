<template>
   <h4 class="q-ma-md q-my-xl text-left">Servicios</h4>
    <div class="flex justify-center items-center column q-pa-md">
        <q-table
        title="Servicios"
        :rows="rows"
        :columns="columns"
        :style="{width: '80%'}"
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
                    <q-btn :to="'/servicio/' + props.row.ID" color="primary" icon="edit"/>
                </q-td>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                <q-card>
                    <q-card-section>
                        <strong class="q-pr-sm">{{ props.row.NOMBRE }}</strong>
                        <q-btn :to="'/servicio/' + props.row.ID" round color="primary" glossy icon="edit" size="12" class="q-ma-xs"/>
                    </q-card-section>
                    <q-separator />
                    <q-list>
                    <template v-for="r in props.cols">
                    <q-item v-if="r.label != 'Nombre' && r.label != 'ID' && r.label != 'Acciones'" :key="r.name" v-ripple>
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
        <q-btn to="/servicio/nuevo" color="primary" :label="'Agregar Nuevo Servicio'" class="q-ma-md" size="20"/>
    </div>
    
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { api } from 'boot/axios'
    import { linkLaravel } from 'src/other/Utils'

    onMounted(async () => {
        let services = await api.get(linkLaravel + "/services")
        rows.value = services.data.map(r =>{
            return {
                ID: r.id,
                NOMBRE: r.name,
                PRECIO: r.price,
                IVA: r.tax + "%",
                VENTAJAS: r.advantages.map((v, idx) => (idx + 1) + ". " + v.name[0].name),
            }
        })
        loading.value = false
    })
    
    let filter = ref('')
    let loading = ref(true)
    let rows = ref([])
    let columns = [
        { name: 'ID', label: 'ID', field: 'ID', required: true, sortable: true, align: 'left' },
        { name: 'NOMBRE', label: 'Nombre', field: 'NOMBRE', required: true, sortable: true, align: 'left'},
        { name: 'PRECIO', label: 'Precio', field: 'PRECIO', required: true, sortable: true, align: 'left'},
        { name: 'IVA', label: 'IVA', field: 'IVA', required: true, sortable: true, align: 'left' },
        { name: 'ACCIONES', label: 'Acciones', field: 'ACCIONES', required: true, sortable: true, align: 'center' }  
    ]
</script>