<script setup>

import {
    ref,
    onMounted
} from 'vue'

import {
    RouterLink
} from 'vue-router'

import api from '../../services/api'

const productos = ref([])

const mostrarModal = ref(false)

const productoEliminar = ref(null)

const toastMensaje = ref('')

const mostrarToast = ref(false)

const cargarProductos = async () => {

    try {

        const response =
            await api.get('/admin/productos')

        productos.value =
            response.data.productos

    } catch(error){

        console.log(error)

    }

}

const abrirEliminar = (producto) => {

    productoEliminar.value =
        producto

    mostrarModal.value = true

}

const eliminarProducto = async () => {

    try {

        await api.delete(

            `/admin/productos/${productoEliminar.value.ID_prod}`

        )

        productos.value =
            productos.value.filter(

                p =>
                    p.ID_prod !==
                    productoEliminar.value.ID_prod

            )

        mostrarModal.value = false

        toastMensaje.value =
            'Producto eliminado correctamente'

        mostrarToast.value = true

        setTimeout(() => {

            mostrarToast.value = false

        }, 3000)

    } catch(error){

        console.log(error)

    }

}

onMounted(() => {

    cargarProductos()

})

</script>

<template>

<div class="container py-5">

    <div class="admin-productos-card">

        <div class="d-flex justify-content-between align-items-center mb-4">

            <div>
                <h2 class="titulo-admin">
                    Productos
                </h2>

                <p class="subtitulo-admin">
                    Gestiona los productos de GARASUATO
                </p>
            </div>

            <RouterLink
                to="/admin/productos/create"
                class="btn-agregar"
            >
                + Nuevo producto
            </RouterLink>

        </div>

        <div
            v-for="producto in productos"
            :key="producto.ID_prod"
            class="producto-row"
        >

            <img
                :src="producto.imagen_url"
                class="producto-img"
            >

            <div class="producto-info">

                <h5>
                    {{ producto.nombre }}
                </h5>

                <p>
                    {{ producto.descripcion }}
                </p>

                <strong>
                    ${{
                        Number(producto.Precio_uni).toLocaleString(
                            'es-MX',
                            {
                                minimumFractionDigits:2
                            }
                        )
                    }} MXN
                </strong>

                <small>
                    Categorías:
                    {{
                        producto.categorias
                        .map(c => c.ncm_cat)
                        .join(', ')
                    }}
                </small>

            </div>

            <div class="acciones-producto">

                <RouterLink
                    :to="`/admin/productos/${producto.ID_prod}/edit`"
                    class="btn-editar"
                >
                    Editar
                </RouterLink>

                <button
                    @click="abrirEliminar(producto)"
                    class="btn-eliminar"
                >
                    Eliminar
                </button>

            </div>

        </div>

    </div>

    <!-- MODAL -->
    <div
        v-if="mostrarModal"
        class="modal-overlay"
    >

        <div class="modal-card">

            <h4>
                ¿Eliminar producto?
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
                    @click="eliminarProducto"
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
        ✔ {{ toastMensaje }}
    </div>

</div>

</template>

<style scoped>

.admin-productos-card{

    background:#f7f7f7;

    border-radius:25px;

    padding:35px;

    box-shadow:0 5px 20px rgba(0,0,0,.12);

}

.titulo-admin{

    color:#192718;

    font-weight:700;

    margin-bottom:4px;

}

.subtitulo-admin{

    color:#777;

    margin:0;

}

.btn-agregar{

    background:#cae2e6;

    color:#192718;

    padding:12px 18px;

    border-radius:14px;

    text-decoration:none;

    font-weight:700;

    transition:.2s ease;

}

.btn-agregar:hover{

    background:#b8dbe0;

}

.producto-row{

    background:white;

    border-radius:20px;

    padding:18px 22px;

    margin-bottom:18px;

    display:flex;

    align-items:center;

    gap:22px;

    box-shadow:0 2px 10px rgba(0,0,0,.08);

    transition:.2s ease;

}

.producto-row:hover{

    transform:translateY(-2px);

    box-shadow:0 6px 18px rgba(0,0,0,.10);

}

.producto-img{

    width:95px;

    height:95px;

    object-fit:cover;

    border-radius:14px;

}

.producto-info{

    flex:1;

}

.producto-info h5{

    color:#192718;

    font-weight:700;

    margin-bottom:6px;

}

.producto-info p{

    color:#555;

    font-size:14px;

    margin-bottom:6px;

}

.producto-info strong{

    display:block;

    color:#192718;

    margin-bottom:4px;

}

.producto-info small{

    color:#777;

}

.acciones-producto{

    display:flex;

    gap:10px;

}

.btn-editar{

    background:#cae2e6;

    color:#192718;

    border:none;

    border-radius:13px;

    padding:10px 16px;

    text-decoration:none;

    font-weight:600;

}

.btn-eliminar{

    background:#192718;

    color:white;

    border:none;

    border-radius:13px;

    padding:10px 16px;

    font-weight:600;

}

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

}

</style>