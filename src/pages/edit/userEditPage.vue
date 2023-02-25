<template>
    <div class="q-pa-xl q-gutter-lg flex window-height justify-center items-center">
      <q-card class="basis-flex-card">
          <q-card-section>
              <div class="text-h6"> Usuario #{{ id }} </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="row">
                    <div class="col-12 col-lg-6 q-pa-md">
                        <q-input
                        v-model="username"
                        filled
                        autogrow
                        label="Nombre de usuario"
                        />
                    </div>
                    <div class="col-12 col-lg-6 q-pa-md">
                        <q-input
                        v-model="email"
                        filled
                        autogrow
                        label="Email"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-4 q-pa-md">
                        <q-input
                            v-model="name"
                            filled
                            autogrow
                            label="Nombre"
                        />
                    </div>
                    <div class="col-12 col-lg-4 q-pa-md">
                        <q-input
                            v-model="first_surname"
                            filled
                            autogrow
                            label="Primer apellido"
                        />
                    </div>
                    <div class="col-12 col-lg-4 q-pa-md">
                        <q-input
                            v-model="second_surname"
                            filled
                            autogrow
                            label="Segundo apellido"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-5 q-pa-md">
                        <q-select
                            filled
                            v-model="department"
                            label="Departamento"
                            :options="options_departments"
                            @filter="filterFnDepartments"
                        />
                    </div>
                    <div class="col-12 col-lg-5 q-pa-md">
                        <q-select
                            filled
                            v-model="type"
                            label="Tipo de usuario"
                            :options="options_types"
                        />
                    </div>
                    <div class="col-12 col-lg-2 q-pa-md flex-center">
                        <q-toggle 
                        v-model="is_active" 
                        label="Cuenta activa?" 
                        size="lg"
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
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useQuasar } from 'quasar'
  // import { useRouter } from 'vue-router';

  const route = useRoute()
  const $q = useQuasar()
  // const router = useRouter()
  let id = route.params.id
  let username = ref(null), 
  email = ref(null), 
  name = ref(null), 
  first_surname = ref(null),
  second_surname = ref(null),
  department = ref(null),
  options_departments = ref([]),
  departments_loaded = ref(false),
  type = ref(null),
  options_types = ref([]),
  is_active = ref(null),
  visible = ref(true)

  const onSubmit = () => {
    visible.value = true
    api.put(linkLaravel + "/user/update", {
        id: id,
        username: username.value,
        email: email.value,
        name: name.value,
        firstSurname: first_surname.value,
        secondSurname: second_surname.value,
        department: department.value.value,
        type: type.value.value,
        isActive: is_active.value === true ? 1 : 0
    }).then(function(res) {
        $q.notify({
            type: 'positive',
            message: 'Se ha actualizado correctamente.'
        })
        visible.value = false
        window.location.href = "/#/usuarios"
    }).catch(function(res){
        $q.notify({
            type: 'negative',
            message: 'Algo ha salido mal.'
        })
        visible.value = false
    })
  }

  const gotoHome = () => {
      // router.push({path: "/incidencias"})
  }

  onMounted(async () => {
      let user = (await api.get(linkLaravel + "/user/" + id)).data

      username.value = user.username
      email.value = user.email
      name.value = user.user_data.name
      first_surname.value = user.user_data.first_surname
      second_surname.value = user.user_data.second_surname ? user.user_data.second_surname : ''
      department.value = user.department ? { value: user.department.id, label: user.department.name } : { value: null, label: "N/A" }
      is_active.value = user.is_active === 1 ? true : false
      options_types.value.push({ value: "USER", label: "Usuario" }, { value: "TECH", label: "Técnico" }, { value: "ADMIN", label: "Administrador" })
      type.value = options_types.value.find(o => o.value === user.type)

      if (department.value.value == null) options_departments.value.push(department.value)
      visible.value = false
  })

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