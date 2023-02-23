<template>
    <q-table
        title="Incidencias"
        :rows="rows"
        :columns="columns"
    />
</template>

<script>
    import { ref, onMounted } from 'vue'
    
    const rows = []
    const columns = []

    export default {
        setup () {
            return {
                rows,
                columns
            }
        }
    }

</script>