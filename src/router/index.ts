import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layout/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Generator',
        component: () => import('../views/GeneratorView.vue'),
        meta: { title: 'Generador' },
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('../views/VideosView.vue'),
        meta: { title: 'Mis videos' },
      },
      {
        path: 'recursos',
        name: 'Assets',
        component: () => import('../views/AssetsView.vue'),
        meta: { title: 'Recursos' },
      },
      {
        path: 'gastos',
        name: 'Spend',
        component: () => import('../views/SpendView.vue'),
        meta: { title: 'Gastos' },
      },
      {
        path: 'usuarios',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: { title: 'Usuarios' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { title: 'Iniciar sesión' },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPasswordView.vue'),
    meta: { title: 'Recuperar contraseña' },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/auth/ResetPasswordView.vue'),
    meta: { title: 'Nueva contraseña' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('access_token')
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  if (requiresAuth && !hasToken) {
    return next({ path: '/login', replace: true })
  }

  if (to.path === '/login' && hasToken) {
    return next({ path: '/', replace: true })
  }

  next()
})

router.afterEach((to) => {
  const title = (to.meta?.title as string) || 'Replay'
  document.title = `${title} | Replay by Bakano`
})

export default router
