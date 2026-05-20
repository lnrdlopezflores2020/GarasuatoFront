<script setup>

import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../services/api'

const usuarios = ref([])

const mostrarModal = ref(false)

const usuarioEliminar = ref(null)

const toastMensaje = ref('')

const mostrarToast = ref(false)

const cargarUsuarios = async () => {

    try {

        const response = await api.get(
            '/admin/usuarios'
        )

        usuarios.value =
            response.data.usuarios

    } catch(error){

        console.log(error)

    }

}

const abrirEliminar = (id) => {

    usuarioEliminar.value = id

    mostrarModal.value = true

}

const eliminarUsuario = async () => {

    try {

        await api.delete(

            `/admin/usuarios/${usuarioEliminar.value}`

        )

        usuarios.value =
            usuarios.value.filter(

                u =>
                    u.ID_usu !== usuarioEliminar.value

            )

        mostrarModal.value = false

        toastMensaje.value =
            'Usuario eliminado correctamente'

        mostrarToast.value = true

        setTimeout(() => {

            mostrarToast.value = false

        }, 3000)

    } catch(error){

        console.log(error)

    }

}

onMounted(() => {

    cargarUsuarios()

})

</script>

<template>

<div class="container py-4">

    <div
        class="d-flex justify-content-between align-items-center mb-4"
    >

        <h2 class="fw-bold">
            Gestión de Usuarios
        </h2>

        <RouterLink
            to="/admin/usuarios/create"
            class="btn btn-success"
        >
            + Agregar Usuario
        </RouterLink>

    </div>

    <div class="table-responsive">

        <table class="table align-middle">

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Municipio</th>
                    <th>Rol</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="usuario in usuarios"
                    :key="usuario.ID_usu"
                >

                    <td>
                        {{ usuario.ID_usu }}
                    </td>

                    <td>
                        {{ usuario.nom_comp }}
                    </td>

                    <td>
                        {{ usuario.correo }}
                    </td>

                    <td>
                        {{ usuario.telefono }}
                    </td>

                    <td>
                        {{ usuario.municipio }}
                    </td>

                    <td>

                        <span
                            v-if="usuario.ID_rol == 1"
                            class="badge bg-dark"
                        >
                            Admin
                        </span>

                        <span
                            v-else
                            class="badge bg-secondary"
                        >
                            Cliente
                        </span>

                    </td>

                    <td>

                        <div class="d-flex gap-2">

                            <RouterLink
                                :to="`/admin/usuarios/${usuario.ID_usu}/edit`"
                                class="btn btn-outline-primary btn-sm"
                            >
                                Editar
                            </RouterLink>

                            <button
                                @click="abrirEliminar(usuario.ID_usu)"
                                class="btn btn-outline-danger btn-sm"
                            >
                                Eliminar
                            </button>

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

    <!-- MODAL -->
<div
    v-if="mostrarModal"
    class="modal-overlay"
>

    <div class="modal-card">

        <h4 class="mb-3">
            ¿Eliminar usuario?
        </h4>

        <p class="text-muted">
            Esta acción no se puede deshacer.
        </p>

        <div class="d-flex justify-content-end gap-2 mt-4">

            <button
                class="btn btn-light"
                @click="mostrarModal = false"
            >
                Cancelar
            </button>

            <button
                class="btn btn-danger"
                @click="eliminarUsuario"
            >
                Eliminar
            </button>

        </div>

    </div>

</div>

<!-- TOAST -->
<div
    v-if="mostrarToast"
    class="toast-gara"
>

     {{ toastMensaje }}

</div>



</div>



</template>


<style scoped>

.modal-overlay{

    position:fixed;
    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    align-items:center;
    justify-content:center;

    z-index:9999;

}

.modal-card{

    background:white;

    padding:30px;

    border-radius:20px;

    width:90%;
    max-width:420px;

    box-shadow:
        0 10px 30px rgba(0,0,0,.15);

}

.toast-gara{

    position:fixed;

    top:20px;
    right:20px;

    background:#9edee9;

    color:#192718;

    padding:14px 20px;

    border-radius:14px;

    font-weight:600;

    z-index:99999;

    box-shadow:
        0 5px 20px rgba(0,0,0,.12);

}

</style>