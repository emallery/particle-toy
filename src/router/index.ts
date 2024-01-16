import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditorView.vue')
    },
    {
      path: '/view',
      name: 'view',
      component: () => import('../views/DisplayView.vue')
    }
  ]
})

export default router
