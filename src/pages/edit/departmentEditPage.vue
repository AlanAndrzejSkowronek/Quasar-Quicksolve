<template>
    <h4 class="q-ma-md q-my-xl text-left">Editar Departamento</h4>
    <div class="q-pa-xl q-gutter-lg flex justify-center items-center">
      <q-card class="basis-flex-card">
          <q-card-section>
              <div class="text-h6"> Departamento #{{ id }} </div>
          </q-card-section>
          <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                  <div class="row">
                      <div class="col-12 col-lg-4 q-pa-md">
                          <q-input
                            v-model="name"
                            filled
                            label="Nombre"
                          />
                      </div>
                      <div class="col-12 col-lg-4 q-pa-md">
                          <q-select
                            v-model="type"
                            filled
                            label="Tipo de repartición de incidencias"
                            :options="typeOptions"
                          />
                      </div>
                      <div class="col-12 col-lg-4 flex justify-around items-center">
                          <q-btn label="Actualizar" type="submit" color="primary" class="q-mx-sm" />
                          <q-btn label="Cancelar" color="negative" class="q-mx-sm" to="/departamentos" />
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
  import { linkLaravel, translator, getLangs } from 'src/other/Utils'
  import { useQuasar } from 'quasar'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const $q = useQuasar()
  let id = route.params.id
  let name = ref(null), 
  type = ref(null),
  typeOptions = ref([]),
  nameLangs = null,
  visible = ref(true)

  const onSubmit = async () => {
    visible.value = true

    let langs = (await getLangs()).data
    nameLangs = Object.assign({}, ...await translator([name.value], langs))
    api.put(linkLaravel + "/department/update", {
        id: id,
        name: name.value,
        type: type.value.value,
        languages: nameLangs
    }).then(function(res) {
        $q.notify({
            type: 'positive',
            message: 'Se ha actualizado correctamente.'
        })
        visible.value = false
        window.location.href = "/#/departamentos"
    }).catch(function(res){
        $q.notify({
            type: 'negative',
            message: 'Algo ha salido mal.'
        })
        visible.value = false
    })
  }

  onMounted(async () => {
      let department = (await api.get(linkLaravel + "/department/" + id)).data
      name.value = department.name
      typeOptions = [{value: "ROUND_ROBIN", label: "Round Robin"}, {value: "LESS_INCIDENCES_TECH", label: "El tecnico con menor incidencias"}]
      type.value = typeOptions.find(obj => obj.value === department.type)
      visible.value = false
  })

</script>