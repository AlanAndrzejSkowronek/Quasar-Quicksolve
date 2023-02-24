<template>
    <div class="flex window-height justify-center items-center q-pa-md">
        <q-table
        title="Espacios / Lugares"
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
                    <q-btn :to="'/espacio/' + props.row.ID" round color="primary" glossy icon="edit"/>
                </q-td>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                <q-card>
                    <q-card-section>
                        <strong class="q-pr-sm">{{ props.row.NOMBRE }}</strong>
                        <q-btn :to="'/espacio/' + props.row.ID" round color="primary" glossy icon="edit" :size="12"/>
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
    </div>
    
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { api } from 'boot/axios'
    import { linkLaravel } from 'src/other/Utils'

    onMounted(async () => {
        let spaces = await api.get(linkLaravel + "/spaces")
        rows.value = spaces.data.map(r =>{
            return {
                ID: r.id,
                NOMBRE: r.name        
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
        { name: 'ACCIONES', label: 'Acciones', field: 'ACCIONES', required: true, sortable: true, align: 'center' }  
    ]
</script>