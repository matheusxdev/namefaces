import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from './views/CatalogView.vue'
import HomeView from './views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const target = document.querySelector(to.hash)
          if (target) {
            resolve({ el: to.hash, behavior: 'smooth' })
            return
          }
          resolve({ top: 0 })
        })
      })
    }

    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'namefaces — cada nome ganha um rosto',
      },
    },
    {
      path: '/rostos',
      name: 'catalog',
      component: CatalogView,
      meta: {
        title: 'Catálogo de rostos — namefaces',
      },
    },
  ],
})

router.afterEach((to) => {
  document.title =
    (to.meta.title as string | undefined) ?? 'namefaces — cada nome ganha um rosto'
})
