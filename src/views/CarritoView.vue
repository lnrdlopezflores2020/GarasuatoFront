<script setup>

import {

    ref,
    onMounted,
    computed

} from 'vue'

import api from '../services/api'

const productos = ref([])

const total = ref(0)

const mostrarModalEliminar = ref(false)

const productoEliminar = ref(null)

const toastMensaje = ref('')

const mostrarToast = ref(false)

const mostrarNotificacion = (mensaje) => {

    toastMensaje.value = mensaje

    mostrarToast.value = true

    setTimeout(() => {

        mostrarToast.value = false

    }, 3000)

}

const usuario = computed(() => {

    return JSON.parse(
        localStorage.getItem('usuario')
    )

})

const cargarCarrito = async () => {

    try {

        const response =
            await api.get('/carrito')

        productos.value =
            response.data.productos

        total.value =
            response.data.total

    } catch(error){

        console.log(error)

    }

}

const actualizarCantidad = async (
    producto,
    cantidad
) => {

    if(cantidad < 1) return

    producto.pivot.cantidad =
        cantidad

    try {

        const response =
            await api.put(

                '/carrito/actualizar',

                {

                    ID_prod:
                        producto.ID_prod,

                    cantidad

                }

            )

        total.value =
            response.data.total

    } catch(error){

        console.log(error)

    }

}

const abrirEliminarProducto = (producto) => {

    productoEliminar.value = producto

    mostrarModalEliminar.value = true

}

const eliminarProducto = async () => {

    try {

        await api.delete(
            `/carrito/eliminar/${productoEliminar.value.pivot.ID_contiene}`
        )

        productos.value =
            productos.value.filter(

                p =>
                    p.pivot.ID_contiene !==
                    productoEliminar.value.pivot.ID_contiene

            )

        mostrarModalEliminar.value = false

        recalcular()

        window.dispatchEvent(
            new Event('carritoActualizado')
        )

        mostrarNotificacion(
            'Producto eliminado del carrito'
        )

    } catch(error){

        console.log(error)

    }

}

const recalcular = () => {

    total.value =
        productos.value.reduce(

            (acc, p) => {

                return acc +

                    (
                        p.pivot.cantidad
                        *
                        p.pivot.precio_unitario
                    )

            },

            0

        )

}

onMounted(() => {

    cargarCarrito()

})

</script>

<template>

<div class="container py-5">

    <div class="carrito-container">

        <h2 class="mb-4">
            Mi carrito
        </h2>

        <div
            v-if="productos.length"
            class="row"
        >

            <!-- PRODUCTOS -->
            <div class="col-lg-8">

                <div

                    v-for="producto in productos"

                    :key="producto.ID_contiene"

                    class="producto-card"

                >

                    <!-- IMG -->
                    <img
                        :src="producto.imagen"
                        class="producto-img"
                    >

                    <!-- INFO -->
                    <div class="producto-info">

                        <h5>
                            {{ producto.nombre }}
                        </h5>

                        <p>

                            ${{
                                Number(
                                    producto.Precio_uni
                                ).toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits:2
                                    }
                                )
                            }}
                            MXN

                        </p>

                        <div
                            v-if="producto.pivot.personalizacion"
                            class="detalles-pedido"
                        >

                            <!-- FUNDA -->
                            <template v-if="producto.pivot.personalizacion.modeloTelefono">

                                <small>
                                    Modelo:
                                    {{ producto.pivot.personalizacion.modeloTelefono }}
                                </small>

                                <br>

                                <small
                                    v-if="producto.pivot.personalizacion.materialFunda"
                                >
                                    Tipo:
                                    {{ producto.pivot.personalizacion.materialFunda }}
                                </small>

                                <br>

                                <small
                                    v-if="producto.pivot.personalizacion.acabadoFunda"
                                >
                                    Acabado:
                                    {{ producto.pivot.personalizacion.acabadoFunda }}
                                </small>

                            </template>

                            <!-- VITRAL -->
                            <template v-if="producto.pivot.personalizacion.tamanoVitral">

                                <small>
                                    Tamaño:
                                    {{ producto.pivot.personalizacion.tamanoVitral }}
                                </small>

                                <br>

                                <small
                                    v-if="producto.pivot.personalizacion.formaVitral"
                                >
                                    Forma:
                                    {{ producto.pivot.personalizacion.formaVitral }}
                                </small>

                            </template>

                            <!-- ROPA -->
                            <template v-if="producto.pivot.personalizacion.tipoPrenda">

                                <small>
                                    Prenda:
                                    {{ producto.pivot.personalizacion.tipoPrenda }}
                                </small>

                                <br>

                                <small>
                                    Color:
                                    {{ producto.pivot.personalizacion.color }}
                                </small>

                                <br>

                                <small>
                                    Talla:
                                    {{ producto.pivot.personalizacion.talla }}
                                </small>

                                <br>

                                <small
                                    v-if="producto.pivot.personalizacion.ubicacionDiseno"
                                >
                                    Diseño:
                                    {{ producto.pivot.personalizacion.ubicacionDiseno }}
                                </small>

                            </template>

                            <!-- NOTAS -->
                            <template v-if="producto.pivot.personalizacion.notas">

                                <br>

                                <small class="text-muted">

                                    
                                    {{ producto.pivot.personalizacion.notas }}

                                </small>

                            </template>

                        </div>

                    </div>

                    <!-- CANTIDAD -->
                    <div class="cantidad-box">

                        <button
                            @click="actualizarCantidad(
                                producto,
                                producto.pivot.cantidad - 1
                            )"
                        >
                            -
                        </button>

                        <span>
                            {{ producto.pivot.cantidad }}
                        </span>

                        <button
                            @click="actualizarCantidad(
                                producto,
                                producto.pivot.cantidad + 1
                            )"
                        >
                            +
                        </button>

                    </div>

                    <!-- ELIMINAR -->
                    <button

                        @click="abrirEliminarProducto(producto)"

                        class="btn-eliminar"

                    >
                        🗑
                    </button>

                </div>

            </div>

            <!-- RESUMEN -->
            <div class="col-lg-4">

                <div class="resumen-card">

                    <h4 class="mb-4">
                        Resumen
                    </h4>

                    <div
                        class="d-flex justify-content-between mb-4"
                    >

                        <span>Total:</span>

                        <strong>

                            ${{
                                Number(total)
                                .toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits:2
                                    }
                                )
                            }}
                            MXN

                        </strong>

                    </div>

                    <button class="btn-pago">

                        Proceder al pago

                    </button>

                    <hr>

                    <div class="text-center">

                        <p class="mb-3">
                            Métodos de pago
                        </p>

                        <div class="d-flex justify-content-center gap-3">

                            <img
                                src="/oxxo.png"
                                style="height:50px;"
                            >

                            <img
                                src="/paypal.png"
                                style="height:50px;"
                            >

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div
            v-else
            class="text-center py-5"
        >

            <h5 class="text-muted">

                Tu carrito está vacío 🛒

            </h5>

        </div>

    </div>

    <!-- MODAL ELIMINAR PRODUCTO -->
<div
    v-if="mostrarModalEliminar"
    class="modal-overlay"
>

    <div class="modal-card">

        <h4 class="mb-3">
            ¿Eliminar producto?
        </h4>

        <p class="text-muted">
            Esta acción eliminará este producto del carrito.
        </p>

        <div class="d-flex justify-content-end gap-2 mt-4">

            <button
                class="btn btn-light"
                @click="mostrarModalEliminar = false"
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
    {{ toastMensaje }}
</div>

</div>

</template>

<style scoped>

.carrito-container{

    background:#f7f7f7;

    border-radius:25px;

    padding:40px;

    box-shadow:0 5px 20px rgba(0,0,0,.15);

}

.producto-card{

    background:white;

    border-radius:20px;

    padding:20px;

    margin-bottom:20px;

    display:flex;

    align-items:center;

    gap:25px;

    box-shadow:0 2px 10px rgba(0,0,0,.08);

}

.producto-img{

    width:90px;

    height:90px;

    object-fit:cover;

    border-radius:12px;

}

.producto-info{

    flex:1;

}

.producto-info h5{

    font-weight:600;

    margin-bottom:10px;

}

.producto-info p{

    color:#444;

    margin:0;

}

.cantidad-box{

    display:flex;

    align-items:center;

    gap:12px;

    background:#cae2e6;

    padding:10px 15px;

    border-radius:15px;

}

.cantidad-box button{

    border:none;

    background:none;

    font-size:18px;

    font-weight:bold;

}

.btn-eliminar{

    border:none;

    background:#cae2e6;

    border-radius:15px;

    padding:12px;

}

.resumen-card{

    background:white;

    border-radius:20px;

    padding:30px;

    box-shadow:0 2px 10px rgba(0,0,0,.08);

}

.btn-pago{

    width:100%;

    border:none;

    background:#cae2e6;

    border-radius:15px;

    padding:14px;

    font-weight:600;

    margin-bottom:20px;

}

.detalles-pedido{

    margin-top:8px;

    font-size:.82rem;

    color:#6b7280;

    line-height:1.5;

}

.modal-overlay{

    position:fixed;
    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    align-items:center;
    justify-content:center;

    z-index:99999;

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