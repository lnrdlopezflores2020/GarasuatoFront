import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../layouts/MainLayout.vue'

import HomeView from '../views/HomeView.vue'
import PersonalizadorView from '../views/PersonalizadorView.vue'
import LoginView from '../views/LoginView.vue'
import Verificacion2FA from '../views/Verificacion2FA.vue'
import RegisterView from '../views/RegisterView.vue'
import PerfilView from '../views/PerfilView.vue'
import ProductoDetalleView from '../views/ProductoDetalleView.vue'
import CarritoView from '../views/CarritoView.vue'
import FavoritosView from '../views/FavoritosView.vue'
import AdminUsuariosView from '../views/admin/AdminUsuariosView.vue'
import AdminUsuarioFormView from '../views/admin/AdminUsuarioFormView.vue'
import AdminProductosView from '../views/admin/AdminProductosView.vue'
import AdminProductoFormView from '../views/admin/AdminProductoFormView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminBackupView from '../views/admin/AdminBackupView.vue'
import QuienesSomosView from '../views/QuienesSomosView.vue'


const rutasProtegidas = ['personalizar', 'admin.usuarios', 'admin.usuarios.create', 'admin.usuarios.edit']
const rutasAdmin = ['admin.usuarios','admin.usuarios.create','admin.usuarios.edit','admin.dashboard']
const router = createRouter({


   
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [

        {
            path: '/',
            component: MainLayout,

            children: [

                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },

                {
                    path: 'personalizar',
                    name: 'personalizar',
                    component: PersonalizadorView
                },

                {
                    path: '/verificar-2fa',
                    name: 'verificar2fa',
                    component: Verificacion2FA
                },

                 {
                    path: '/login',
                    name: 'login',
                    component: LoginView
                },

                {
                    path: '/register',
                    component: RegisterView
                },

                {
                    path: '/perfil',
                    name: 'perfil',
                    component: PerfilView
                },

                {
                    path: '/producto/:id',
                    name: 'productoDetalle',
                    component: ProductoDetalleView
                },

                {
                    path: '/carrito',

                    name: 'carrito',

                    component: CarritoView
                },

                {
                    path: '/favoritos',
                    name: 'favoritos',
                    component: FavoritosView
                },

                {
                    path: '/admin/usuarios',
                    name: 'admin.usuarios',
                    component: AdminUsuariosView
                },

                {
                    path: '/admin/usuarios/create',
                    name: 'admin.usuarios.create',
                    component: AdminUsuarioFormView
                },

                {
                    path: '/admin/usuarios/:id/edit',
                    name: 'admin.usuarios.edit',
                    component: AdminUsuarioFormView
                },

                {
                    path: '/admin/productos',
                    name: 'admin.productos',
                    component: AdminProductosView,
                    meta: { admin: true }
                },

                {
                    path: '/admin/productos/create',
                    name: 'admin.productos.create',
                    component: AdminProductoFormView,
                    meta: { admin: true }
                },

                {
                    path: '/admin/productos/:id/edit',
                    name: 'admin.productos.edit',
                    component: AdminProductoFormView,
                    meta: { admin: true }
                },

                {
                    path: '/admin/dashboard',
                    name: 'admin.dashboard',
                    component: AdminDashboardView,
                    meta: {
                        requiresAdmin: true
                    }
                },

                {
                    path: '/admin/backup',
                    name: 'admin.backup',
                    component: AdminBackupView,
                    meta: { requiresAdmin: true }
                },

                {
                    path: '/quienes-somos',
                    name: 'quienes.somos',
                    component: QuienesSomosView
                },

            ]

        }
    ]

})

router.beforeEach((to, from, next) => {

    const token = localStorage.getItem('token')

    const usuario = JSON.parse(
        localStorage.getItem('usuario') || 'null'
    )

    if(
        rutasProtegidas.includes(to.name)
        &&
        !token
    ){

        next('/login')

    } else if(
        rutasAdmin.includes(to.name)
        &&
        (
            !token ||
            usuario?.ID_rol != 1
        )
    ){

        next('/')

    } else {

        next()

    }

})


export default router