<template>
    <div class="q-pa-xl q-gutter-lg flex window-height justify-center items-center">
      <q-card class="basis-flex-card">
          <q-card-section>
              <div class="text-h6"> Incidencia #{{ id }} </div>
          </q-card-section>
          <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                  <div class="row">
                      <div class="col-12 col-lg-6 q-pa-md">
                          <q-input
                            v-model="name"
                            filled
                            label="Nombre"
                          />
                      </div>
                      <div class="col-12 col-lg-6 q-pa-md">
                        <q-input
                            v-model="price"
                            filled
                            label="Precio"
                        />
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-lg-6 q-pa-md">
                        
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
  import { useQuasar } from 'quasar'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  // import { useRouter } from 'vue-router';

  const route = useRoute()
  const $q = useQuasar()
  // const router = useRouter()
  let id = route.params.id
  let title = ref(null), 
  description = ref(null), 
  department = ref(null), 
  space = ref(null),
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

  const gotoHome = () => {
      // router.push({path: "/incidencias"})
  }

  onMounted(async () => {
      let incidence = (await api.get(linkLaravel + "/service/" + id)).data

      title.value = incidence.title
      description.value = incidence.description
      department.value = incidence.department ? { value: incidence.department.id, label: incidence.department.name } : { value: null, label: "N/A" }
      space.value = incidence.space ? { value: incidence.space.id, label: incidence.space.name } : { value: null, label: "N/A" }
      
      if (department.value.value == null) options_departments.value.push(department.value)
      if (space.value.value == null) options_spaces.value.push(space.value)
      visible.value = false
  })

</script>