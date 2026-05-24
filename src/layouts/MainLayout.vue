<script setup>

import {

    ref,
    onMounted,
    onUnmounted

} from 'vue'

import {

    RouterLink,
    useRouter

} from 'vue-router'

import api from '../services/api'

const router = useRouter()

const carritoCount = ref(0)

const usuario = ref(null)

const cargarUsuario = () => {

    const data =
        localStorage.getItem('usuario')

    usuario.value =
        data
            ? JSON.parse(data)
            : null

}

onMounted(() => {

    cargarUsuario()

    cargarCarrito()

    window.addEventListener(
        'usuarioActualizado',
        cargarUsuario
    )

    window.addEventListener(
        'carritoActualizado',
        cargarCarrito
    )

})

onUnmounted(() => {

    window.removeEventListener(
        'usuarioActualizado',
        cargarUsuario
    )

    window.removeEventListener(
        'carritoActualizado',
        cargarCarrito
    )

})

const logout = () => {

    localStorage.removeItem('token')

    localStorage.removeItem('usuario')

    localStorage.removeItem('correo')

    usuario.value = null

    router.push('/login')

}

const cargarCarrito = async () => {

    const token =
        localStorage.getItem('token')

    if(!token){

        carritoCount.value = 0

        return

    }

    try {

        const response =
            await api.get('/carrito')

        carritoCount.value =
            response.data.productos.reduce(

                (acc, p) => {

                    return acc +
                        p.pivot.cantidad

                },

                0

            )

    } catch(error){

        console.log(error)

    }

}

</script>

<template>

<div class="layout-body">

    <!-- HEADER -->
    <div class="menu-header">

        <button
            class="btn btn-outline-dark"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuLateral"
        >
            <i class="bi bi-list"></i>
        </button>

        <div class="text-center flex-grow-1">

            <RouterLink
                to="/"
                class="nav-link active titulo-gara"
            >
                GARASUATO
            </RouterLink>

            <div class="subtitulo-gara">
                Personaliza tu mundo con un toque de arte
            </div>

        </div>

        <div class="iconos-header d-flex align-items-center">

            <a href="#">
                <i class="bi bi-search"></i>
            </a>

            <!-- PERFIL -->
            <div class="dropdown-perfil ms-3">

                <RouterLink
                    :to="usuario ? '/perfil' : '/login'"
                    class="perfil-trigger"
                >

                    <div class="perfil-wrapper">

                        <img
                            v-if="usuario?.foto_perfil"
                            :src="usuario.foto_perfil"
                            class="icono-perfil"
                        >

                        <i
                            v-else
                            class="bi bi-person-fill"
                        ></i>

                    </div>

                </RouterLink>

                <div
                    v-if="usuario"
                    class="menu-perfil"
                >

                    <RouterLink
                        to="/perfil"
                        class="dropdown-item"
                    >
                        <i class="bi bi-person me-2"></i>
                        Ver perfil
                    </RouterLink>

                    <RouterLink
                        v-if="usuario.ID_rol == 2"
                        to="/favoritos"
                        class="dropdown-item"
                    >
                        <i class="bi bi-heart me-2 text-danger"></i>
                        Mis favoritos
                    </RouterLink>

                    <button
                        @click="logout"
                        class="dropdown-item text-danger"
                    >

                        <i class="bi bi-box-arrow-right me-2"></i>

                        Cerrar sesión

                    </button>

                </div>

            </div>

            <!-- CARRITO SOLO CLIENTE / PÚBLICO -->
            <RouterLink
                v-if="!usuario || usuario.ID_rol == 2"
                to="/carrito"
                class="ms-3"
            >

                <div style="position: relative;">

                    <i class="bi bi-cart"></i>

                    <span id="contadorCarrito">
                        {{ carritoCount }}
                    </span>

                </div>

            </RouterLink>

        </div>

    </div>

    <!-- MENU LATERAL -->
    <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="menuLateral"
    >

        <div class="offcanvas-header">

            <h4 class="offcanvas-title menu-title">
                MENÚ
            </h4>

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
            ></button>

        </div>

        <hr>

        <div class="menu-scroll">

            <ul class="list-group menu-list">

                <!-- MENÚ ADMIN -->
                <template v-if="usuario && usuario.ID_rol == 1">

                    <RouterLink
                        to="/admin/usuarios"
                        class="nav-link active"
                    >
                        GESTIÓN DE USUARIOS
                    </RouterLink>

                    <RouterLink
                        to="/admin/productos"
                        class="nav-link active"
                    >
                        GESTIÓN DE PRODUCTOS
                    </RouterLink>

                    <RouterLink
                        to="/admin/dashboard"
                        class="nav-link active"
                    >
                        DASHBOARD
                    </RouterLink>

                    <RouterLink
                        to="/admin/backup"
                        class="nav-link active"
                    >
                        RESPALDO BD
                    </RouterLink>

                </template>

                <!-- MENÚ CLIENTE / PÚBLICO -->
                <template v-else>

                    <a class="nav-link active" href="#">
                        FUNDAS
                    </a>

                    <a class="nav-link active" href="#">
                        VITRALES
                    </a>

                    <a class="nav-link active" href="#">
                        SUDADERAS
                    </a>

                    <RouterLink
                        to="/personalizar"
                        class="nav-link active"
                    >
                        MI PERSONALIZADO
                    </RouterLink>

                    <RouterLink
                        v-if="usuario && usuario.ID_rol == 2"
                        to="/favoritos"
                        class="nav-link active"
                    >
                        MIS FAVORITOS
                    </RouterLink>

                    <RouterLink
                        v-if="usuario && usuario.ID_rol == 2"
                        to="/carrito"
                        class="nav-link active"
                    >
                        MI CARRITO
                    </RouterLink>

                </template>

            </ul>

            <div class="menu-img-container">

                <RouterLink to="/quienes-somos">

                    <img
                        src="/hongo gara.png"
                        class="menu-img"
                    />

                </RouterLink>

            </div>

        </div>

    </div>

    <!-- CONTENIDO -->
    <main class="container mt-4">

        <router-view />

    </main>

    <!-- FOOTER -->
    <footer class="footer-gara">

        <p>
            Síguenos en

            <a
                href="https://www.instagram.com/garasuato_01"
                target="_blank"
            >
                <i class="bi bi-instagram"></i>
                Instagram
            </a>

            | © GARASUATO.COM

        </p>

    </footer>

</div>

</template>