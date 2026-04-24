import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import cadastro from '../views/cadastro.vue'
import relatorio from '../views/relatorio.vue'
import reserva from '../views/reserva.vue'
import estoque from '../views/estoque.vue'
import dashboard from '../views/dashboard.vue'

const routes = [
{ path: '/', component: home },
{ path: '/login', component: login },

 {
    path: '/dashboard',
    component: dashboard,
    meta: { requiresAuth: true },
    children: [
{ path: '/cadastro', component: cadastro },
{ path: '/relatorio', component: relatorio },
{ path: '/reserva', component: reserva },
{ path: '/estoque', component: estoque },
]
}
]

const router = createRouter({
history: createWebHistory(),
routes
})
export default router