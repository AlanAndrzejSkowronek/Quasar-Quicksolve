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
    import axios from 'src/boot/axios'

    export default {
        setup () {
            const $q = useQuasar()

            return {
                email: ref(''),
                password: ref(''),
                isPwd: ref(true),
                onSubmit() {
                    if (!this.email && !this.password){
                        $q.notify({
                            type: 'negative',
                            message: 'Falta el usuario y/o la contraseña.'
                        })
                    }
                    if (!this.login(this.email, this.password)){
                        $q.notify({
                            type: 'negative',
                            message: 'No se ha podido verificar el usuario.'
                        })
                    }
                }
                
            }
        },
        methods: {
            login(email, password) {
                axios.post("http://spring-qs/loginTokenGeneratePrivate", JSON.stringify({
                    "email": email,
                    "password": password
                }, { headers: { 'Content-Type': 'application/json' } }))
                .then(function(res){
                    localStorage.setItem('token', "Bearer " + token);
                    console.log(res)
                    return true;
                })
                .catch(function(res){
                    console.log(res)
                    return false;
                })
            }
        }
    }
</script>