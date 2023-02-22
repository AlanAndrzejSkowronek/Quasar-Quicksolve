<template>

<div class="row flex-center" style="height: 100vh;">
<div class="col-12" style="max-width: 400px">
    <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
    >
        <q-input v-model="email" filled type="email" hint="Email" />
        <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Contraseña">
            <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
            </template>
        </q-input>
        <div>
            <q-btn label="Enviar" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
    </q-form>
</div>
</div>
</template>
  
<script>
    import { ref } from 'vue'
    import { useQuasar } from 'quasar'
    import axios from 'axios'
    import { linkSpring } from 'src/other/Utils'

    export default {
        setup () {

            const $q = useQuasar()
            const email = ref(null)
            const password = ref(null)
            const isPwd = ref(true)
            
            function login(email, password) {
                let data = JSON.stringify({"email": email, "password": password})
                axios.post(linkSpring + "/loginTokenGeneratePrivate", data, { headers: { 'Content-Type': 'application/json' } })
                .then(function(res){
                    localStorage.setItem('token', "Bearer " + res.data);
                    $q.notify({
                        type: 'positive',
                        message: 'Se ha verificado el usuario.'
                    })
                    window.location.href = "/#/home";
                })
                .catch(function(res){
                    $q.notify({
                        type: 'negative',
                        message: res.response.data
                    })
                })
            }

            return {
                email,
                password,
                isPwd,
                onSubmit() {
                    if (!email.value || !password.value){
                        $q.notify({
                            type: 'negative',
                            message: 'El usuario y/o la contraseña no se han rellenado.'
                        })
                    } else {
                        login(email.value, password.value)
                    }
                },
                onReset(){
                    email.value = null
                    password.value = null
                }
                
            }
        }
    }
</script>