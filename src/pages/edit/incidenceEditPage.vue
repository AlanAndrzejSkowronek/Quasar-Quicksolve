<template>
      <div class="q-pa-xl q-gutter-lg">
        <q-card>
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
                            <q-btn label="Cancelar" color="negative" class="q-mx-md" @onclick="gotoHome" />
                        </div>
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
    import { api } from 'src/boot/axios';
    import { linkLaravel } from 'src/other/Utils';
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';

    const route = useRoute()
    const router = useRouter()
    let id = route.params.id
    let title = ref(null), 
    description = ref(null), 
    department = ref(null), 
    space = ref(null),
    options_departments = ref([]),
    options_spaces = ref([])

    const onSubmit = () => {
        console.log({
            id: id,
            title: title.value,
            description: description.value,
            department_id: department.value.value,
            space_id: space.value.value
        })
    }

    const gotoHome = () => {
        router.push({path: "/incidencias"})
    }

    onMounted(async () => {
        let incidence = (await api.get(linkLaravel + "/incidence/" + id)).data
        
        title.value = incidence.title
        description.value = incidence.description
        department.value = incidence.department ? { value: incidence.department.id, label: incidence.department.name } : { value: null, label: "N/A" }
        space.value = incidence.space ? { value: incidence.space.id, label: incidence.space.name } : { value: null, label: "N/A" }
        
        if (department.value.value == null) options_departments.value.push(department.value)
        if (space.value.value == null) options_spaces.value.push(space.value)
    })

    const filterFnSpaces = async (val, update, abort) => {
        if (options_spaces.value.length > 1) {
            update()
            return
        }
        let spaces = await api.get(linkLaravel + "/spaces")
        let spacesParsed = spaces.data.map(s => { return { value: s.id, label: s.name } })
        update(() => {
            spacesParsed.forEach(element => { options_spaces.value.push(element) })
        })
    }

    const filterFnDepartments = async (val, update, abort) => {
        if (options_departments.value.length > 1) {
            update()
            return
        }
        let departments = await api.get(linkLaravel + "/departments")
        let departmentsParsed = departments.data.map(d => { return { value: d.id, label: d.name } })
        update(() => {
            departmentsParsed.forEach(element => { options_departments.value.push(element) })
        })
    }

</script>