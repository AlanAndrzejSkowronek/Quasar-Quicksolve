<template>
    <div class="q-pa-xl q-gutter-lg flex window-height justify-center items-center">
      <q-card class="basis-flex-card">
          <q-card-section>
              <div class="text-h6"> Nuevo Servicio </div>
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
                        <q-input
                            v-model="price"
                            filled
                            label="Precio"
                        />
                      </div>
                      <div class="col-12 col-lg-4 q-pa-md">
                        <q-input
                            v-model="tax"
                            filled
                            label="IVA"
                        />
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-lg-6 q-pa-md">
                        <q-input
                            v-model="adv1"
                            filled
                            label="Ventaja 1"
                        />
                    </div>
                    <div class="col-12 col-lg-6 q-pa-md">
                        <q-input
                            v-model="adv2"
                            filled
                            label="Ventaja 2"
                        />
                    </div>
                  </div>
                  <div class="row">
                      <div class="col-12 flex justify-end">
                          <q-btn label="Guardar" type="submit" color="primary" class="q-mx-md" />
                          <q-btn label="Cancelar" color="negative" class="q-mx-md" to="/servicios" />
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
  import { ref } from 'vue'

  const $q = useQuasar()
  let name = ref(null), 
  adv1 = ref(null),
  adv2 = ref(null),
  adv1Langs = null,
  adv2Langs = null,
  price = ref(null),
  tax = ref(null),
  visible = ref(false)

  const onSubmit = async () => {
    visible.value = true
    let langs = (await getLangs()).data
    adv1Langs = Object.assign({}, ...await translator([adv1.value], langs))
    adv2Langs = Object.assign({}, ...await translator([adv2.value], langs))
    api.post(linkLaravel + "/service/save", {
        name: name.value,
        price: price.value,
        tax: tax.value,
        advantageOne: adv1.value,
        advantageTwo: adv2.value,
        advantageOneLangs: adv1Langs,
        advantageTwoLangs: adv2Langs
    }).then(function(res) {
        $q.notify({
            type: 'positive',
            message: 'Se ha guardado correctamente.'
        })
        visible.value = false
        window.location.href = "/#/servicios"
    }).catch(function(res){
        $q.notify({
            type: 'negative',
            message: 'Algo ha salido mal.'
        })
        visible.value = false
    })
  }

</script>