<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quicksolve
        </q-toolbar-title>
        <div> 
          Salir 
          <q-btn
            flat
            dense
            round
            icon="logout"
            aria-label="Logout"
            @click="logout"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      bordered
    >
      <q-list>
        <q-item-label header>
          Base de datos
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    caption: 'Pagina de Inicio',
    icon: 'home',
    link: '/#/home'
  },
  {
    title: 'Incidencias',
    caption: 'Tabla de Incidencias',
    icon: 'list_alt',
    link: '/#/incidencias'
  },
  {
    title: 'Usuarios',
    caption: 'Tabla de Usuarios',
    icon: 'group',
    link: '/#/usuarios'
  },
  {
    title: 'Servicios',
    caption: 'Tabla de Servicios',
    icon: 'smart_button',
    link: '/#/servicios'
  },
  {
    title: 'Departamentos',
    caption: 'Tabla de Departamentos',
    icon: 'apartment',
    link: '/#/departamentos'
  },
  {
    title: 'Espacios',
    caption: 'Tabla de Espacios',
    icon: 'pin_drop',
    link: '/#/espacios'
  },
  {
    title: 'Traducciones',
    caption: 'Generador de Idiomas',
    icon: 'translate',
    link: '/#/traducciones'
  },
  {
    title: 'Informes',
    caption: 'Generador de Informes',
    icon: 'info',
    link: '/#/informes'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
})
</script>
