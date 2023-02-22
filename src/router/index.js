import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import axios from 'axios'
import { linkSpring } from 'src/other/Utils'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async to => {
    if (!(to.path === "/")){
      if (localStorage.getItem("token")){
        let tokenString = localStorage.getItem("token").replace("Bearer ", "")
        let rq = axios.post(linkSpring + "/token/validar", tokenString)
        
        let errCatch = await rq.catch(err => {
          if (err.response.status == "401"){
            return { path: "/" }
          }
        })
        if (errCatch.path == "/"){
          return errCatch
        }
      } else {
        return { path: "/" }
      }
    }
  })

  return Router
})
