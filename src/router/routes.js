
const routes = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/',
    children: [
      { path: '', component: () => import('pages/loginPage.vue') }
    ]
  },
  {
    path: '/incidencias',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/incidenciasPage.vue') }
    ]
  },
  {
    path: '/usuarios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/usersPage.vue') }
    ]
  },
  {
    path: '/servicios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/servicesPage.vue') }
    ]
  },
  {
    path: '/departamentos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/departmentsPage.vue') }
    ]
  },
  {
    path: '/espacios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/spacesPage.vue') }
    ]
  },
  {
    path: '/incidencia/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/edit/incidenceEditPage.vue') }
    ]
  },
  {
    path: '/usuario/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/edit/userEditPage.vue') }
    ]
  },
  {
    path: '/servicio/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/edit/serviceEditPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
