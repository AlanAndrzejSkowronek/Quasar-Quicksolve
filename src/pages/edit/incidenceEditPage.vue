<template>
    <h4 class="q-ma-md q-my-xl text-left">Editar Incidencia</h4>
      <div class="q-pa-xl q-gutter-lg flex justify-center items-center">
        <q-card class="basis-flex-card">
            <q-card-section>
                <div class="text-h6"> Incidencia #{{ id }} </div>
            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <div class="row">
                        <div class="col-12 col-lg-6 q-pa-md">
                            <q-input
                            v-model="title"
                            filled
                            autogrow
                            label="Título"
                            />
                        </div>
                        <div class="col-12 col-lg-6 q-pa-md">
                            <q-select
                                filled
                                v-model="department"
                                label="Departamento"
                                :options="options_departments"
                                @filter="filterFnDepartments"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-lg-6 q-pa-md">
                            <q-input
                                v-model="description"
                                filled
                                autogrow
                                label="Descripción"
                            />
                        </div>
                        <div class="col-12 col-lg-6 q-pa-md">
                            <q-select
                                filled
                                v-model="space"
                                label="Espacio"
                                :options="options_spaces"
                                @filter="filterFnSpaces"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 flex justify-end">
                            <q-btn label="Actualizar" type="submit" color="primary" class="q-mx-md" />
                            <q-btn label="Cancelar" color="negative" class="q-mx-md" to="/incidencias" />
                        </div>
                    </div>
                </q-form>
                <q-inner-loading
                    :showing="visible"
                    label="Porfavor espere..."
                    label-style="font-size: 1.5em; color: white; padding: 7.5px; background-color: rgba(0, 0, 0, 0.75); border-radius: 8px; margin-top: 12px;"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<style>

.basis-flex-card {
    flex-basis: 67.5%;
}

@media (max-width: 1000px) {
    .basis-flex-card {
        flex-basis: 100%;
    }
}

</style>

<script setup>
    import { api } from 'src/boot/axios'
    import { linkLaravel } from 'src/other/Utils'
    import { useQuasar } from 'quasar'
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const $q = useQuasar()
    let id = route.params.id
    let title = ref(null), 
    description = ref(null), 
    department = ref(null), 
    space = ref(null),
    options_departments = ref([]),
    options_spaces = ref([]),
    departments_loaded = ref(false),
    spaces_loaded = ref(false),
    visible = ref(true)

    const onSubmit = () => {
        visible.value = true
        api.put(linkLaravel + "/incidence/update", {
            id: id,
            title: title.value,
            description: description.value,
            department_id: department.value.value,
            space_id: space.value.value
        }).then(function(res) {
            $q.notify({
                type: 'positive',
                message: 'Se ha actualizado correctamente.'
            })
            visible.value = false
            window.location.href = "/#/incidencias"
        }).catch(function(res){
            $q.notify({
                type: 'negative',
                message: 'Algo ha salido mal.'
            })
            visible.value = false
        })
    }

    onMounted(async () => {
        let incidence = (await api.get(linkLaravel + "/incidence/" + id)).data

        title.value = incidence.title
        description.value = incidence.description
        department.value = incidence.department ? { value: incidence.department.id, label: incidence.department.name } : { value: null, label: "N/A" }
        space.value = incidence.space ? { value: incidence.space.id, label: incidence.space.name } : { value: null, label: "N/A" }
        
        if (department.value.value == null) options_departments.value.push(department.value)
        if (space.value.value == null) options_spaces.value.push(space.value)
        visible.value = false
    })

    const filterFnSpaces = async (val, update, abort) => {
        if (spaces_loaded.value == true) {
            update()
            return
        }
        let spaces = await api.get(linkLaravel + "/spaces")
        spaces_loaded.value = true
        let spacesParsed = spaces.data.map(s => { return { value: s.id, label: s.name } })
        update(() => {
            spacesParsed.forEach(element => { options_spaces.value.push(element) })
        })
    }

    const filterFnDepartments = async (val, update, abort) => {
        if (departments_loaded.value == true) {
            update()
            return
        }
        let departments = await api.get(linkLaravel + "/departments")
        departments_loaded.value = true
        let departmentsParsed = departments.data.map(d => { return { value: d.id, label: d.name } })
        update(() => {
            departmentsParsed.forEach(element => { options_departments.value.push(element) })
        })
    }

</script>