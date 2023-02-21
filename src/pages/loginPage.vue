<template>

<div class="q-pa-md" style="max-width: 400px">

    <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
    >
        <q-input standout="bg-primary text-white" v-model="email" filled type="email" hint="Email" />
        <q-input standout="bg-primary text-white" v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password">
            <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
            </template>
        </q-input>
        <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
    </q-form>

</div>
</template>
  
<script>
    import { ref } from 'vue'
    import { useQuasar } from 'quasar'
    import axios from 'axios'

    export default {
        setup () {

            const $q = useQuasar()
            const email = ref(null)
            const password = ref(null)
            const isPwd = ref(true)
            
            function login(email, password) {
                let data = JSON.stringify({"email": email, "password": password})
                axios.post("http://localhost:8080/loginTokenGeneratePrivate", data, { headers: { 'Content-Type': 'application/json' } })
                .then(function(res){
                    localStorage.setItem('token', "Bearer " + res.data);
                    $q.notify({
                        type: 'positive',
                        message: 'Se ha verificado el usuario.'
                    })
                    console.log(res)
                })
                .catch(function(res){
                    $q.notify({
                        type: 'negative',
                        message: 'El usuario no se ha podido verificar.'
                    })
                    console.log(res)
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