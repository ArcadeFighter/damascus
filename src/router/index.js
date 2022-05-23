import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Domů',
    component: Home
  },
  {
    path: '/reticles',
    name: 'Reticley',
    component: () => import(/* webpackChunkName: "reticles" */ '../views/Reticles.vue')
  },
  {
    path: '/challenges',
    name: 'Challenge',
    component: () => import(/* webpackChunkName: "challenges" */ '../views/Challenges.vue')
  },
  {
    path: '/about',
    name: 'Informace',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/settings',
    name: 'Nastavení',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
