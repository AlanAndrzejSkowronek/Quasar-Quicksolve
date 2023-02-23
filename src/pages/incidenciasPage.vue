<template>
    <div class="flex window-height justify-center items-center">
        <q-table
        title="Incidencias"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="loading"
        :table-header-style="{ maxWidth: '100px' }"
        >
            <template v-slot:body-cell-ACCIONES="props">
                <q-td :props="props">
                    <q-btn :to="'/incidencia/' + props.row.ID" round color="primary" glossy icon="edit"/>
                </q-td>
            </template>
        </q-table>
    </div>
    
</template>

<script>
    import { ref } from 'vue'
    import { api } from 'boot/axios'
    import { linkLaravel } from 'src/other/Utils'

    let rows = ref([])
    let columns = [
        {
            name: 'ID',
            label: 'ID',
            field: 'ID',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'TITULO',
            label: 'Título',
            field: 'TITULO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'DESCRIPCION',
            label: 'Descripción',
            field: 'DESCRIPCION',
            required: true,
            sortable: true,
            align: 'left',
            style: ' max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
        },
        {
            name: 'FECHA_INICIO',
            label: 'Fecha de inicio',
            field: 'FECHA_INICIO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'FECHA_FINAL',
            label: 'Fecha final',
            field: 'FECHA_FINAL',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'ESPACIO',
            label: 'Espacio',
            field: 'ESPACIO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'DEPARTAMENTO',
            label: 'Departamento',
            field: 'DEPARTAMENTO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'USUARIO',
            label: 'Usuario',
            field: 'USUARIO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'TECH',
            label: 'Técnico',
            field: 'TECH',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'ESTADO',
            label: 'Estado',
            field: 'ESTADO',
            required: true,
            sortable: true,
            align: 'left'
        },
        {
            name: 'ACCIONES',
            label: 'Acciones',
            field: 'ACCIONES',
            required: true,
            sortable: true,
            align: 'center'
        }
    ]

    export default {
        setup () {
            const comprobarUsuario = (user, email) => {
                return user ? construirNombreUser(user) : email 
            }

            const construirNombreUser = (user) => {
                if (user) return user.user_data.name + " " + user.user_data.first_surname + " " + user.user_data.second_surname 
                else return "N/A"
            }

            return {
                rows,
                columns,
                comprobarUsuario,
                construirNombreUser,
                loading: ref(true)
            }
        },
        async mounted(){
            let incidences = await api.get(linkLaravel + "/incidences")
            this.rows = incidences.data.map(r =>{
                return {
                    ID: r.id,
                    TITULO: r.title,
                    DESCRIPCION: r.description,
                    FECHA_INICIO: r.date_start,
                    FECHA_FINAL: r.date_end ? r.date_end : "N/A",
                    ESPACIO: r.space.name,
                    DEPARTAMENTO: r.department.name,
                    USUARIO: this.comprobarUsuario(r.user, r.email),
                    TECH: this.construirNombreUser(r.tech),
                    ESTADO: r.incidenceState.status_name
                }
            })
            this.loading = false
        }
    }
</script>