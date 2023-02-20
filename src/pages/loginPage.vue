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
    export default {
        setup () {
            return {
                email: ref(''),
                password: ref(''),
                isPwd: ref(true)
            }
        }
    }
</script>