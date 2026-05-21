<script setup>

import {

    ref,
    onMounted,
    computed

} from 'vue'

import {

    useRoute

} from 'vue-router'

import api from '../services/api'

const route = useRoute()

const producto = ref(null)

const promedio = ref(0)

const totalComentarios = ref(0)

const comentario = ref('')

const calificacion = ref(0)

const cantidad = ref(1)

const loadingCarrito = ref(false)

const textoBoton = ref('Agregar al carrito')

const cargandoCarrito = ref(false)

const mostrarModal = ref(false)

const personalizacion = ref({
    modeloTelefono: '',
    materialFunda: '',
    acabadoFunda: '',

    tamanoVitral: '',
    formaVitral: '',
    tipoInstalacion: '',

    tipoPrenda: '',
    color: '',
    talla: '',
    ubicacionDiseno: '',

    notas: ''
})

const toastMensaje = ref('')

const toastTipo = ref('success')

const mostrarToast = ref(false)

const comentarioEliminar = ref(null)

const mostrarModalEliminar = ref(false)

const comentarioMenu = ref(null)

const mostrarNotificacion = (mensaje, tipo = 'success') => {

    toastMensaje.value = mensaje

    toastTipo.value = tipo

    mostrarToast.value = true

    setTimeout(() => {

        mostrarToast.value = false

    }, 3000)

}

const abrirEliminarComentario = (idComentario) => {

    comentarioEliminar.value =
        idComentario

    comentarioMenu.value = null

    mostrarModalEliminar.value = true

}

const usuario = computed(() => {

    return JSON.parse(
        localStorage.getItem('usuario')
    )

})

const cargarProducto = async () => {

    try {

        const response = await api.get(

            `/productos/${route.params.id}`

        )

        producto.value =
            response.data.producto

        promedio.value =
            response.data.promedio

        totalComentarios.value =
            response.data.totalComentarios

    } catch(error){

        console.log(error)

    }

}

const seleccionarEstrella = (numero) => {

    calificacion.value = numero

}

const enviarComentario = async () => {

    if(comentario.value.trim() === ''){

        mostrarNotificacion(
            'Escribe un comentario',
            'warning'
        )

        return

    }

    if(calificacion.value === 0){

        mostrarNotificacion(
            'Selecciona una calificación',
            'warning'
        )

        return

    }

    try {

        const response = await api.post(

            '/comentarios',

            {

                ID_prod:
                    producto.value.ID_prod,

                comentario:
                    comentario.value,

                calificacion:
                    calificacion.value

            }

        )

        producto.value.comentarios.push({

            comentario:
                response.data.comentario,

            calificacion:
                response.data.calificacion,

            usuario: {

                nombre:
                    response.data.usuario

            }

        })

        comentario.value = ''

        calificacion.value = 0

        mostrarNotificacion(
            'Comentario agregado correctamente',
            'success'
        )

    } catch(error){

        console.log(error)

        mostrarNotificacion(
            'Error al guardar comentario',
            'error'
        )

    }

}

const eliminarComentario = async () => {

    try {

        await api.delete(

            `/comentarios/${comentarioEliminar.value}`

        )

        producto.value.comentarios =
            producto.value.comentarios.filter(

                comentario =>
                    comentario.ID_com !== comentarioEliminar.value

            )

        mostrarModalEliminar.value = false

        mostrarNotificacion(
            'Comentario eliminado correctamente',
            'success'
        )

    } catch(error){

        console.log(error)

        mostrarNotificacion(
            'No se pudo eliminar el comentario',
            'error'
        )

    }

}

const esFavorito = computed(() => {

    if(!usuario.value) return false

    return producto.value?.favoritos?.some(

        fav =>
            fav.ID_usu === usuario.value.ID_usu

    )

})

const toggleFavorito = async () => {

    try {

        if(esFavorito.value){

            await api.delete(
                `/favoritos/${producto.value.ID_prod}`
            )

            producto.value.favoritos =
                producto.value.favoritos.filter(

                    fav =>
                        fav.ID_usu !== usuario.value.ID_usu

                )

        } else {

            await api.post(
                `/favoritos/${producto.value.ID_prod}`
            )

            producto.value.favoritos.push({

                ID_usu:
                    usuario.value.ID_usu

            })

        }

    } catch(error){

        console.log(error)

    }

}

const agregarCarrito = async () => {

    try {

        mostrarModal.value = false

        cargandoCarrito.value = true

        textoBoton.value = 'Añadiendo...'

        await api.post('/carrito/agregar', {

            ID_prod: producto.value.ID_prod,

            cantidad: cantidad.value,

            personalizacion: JSON.stringify(personalizacion.value)

        })

        window.dispatchEvent(
            new Event('carritoActualizado')
        )

        textoBoton.value = 'Añadido'

        setTimeout(() => {

            textoBoton.value =
                'Agregar al carrito'

            cargandoCarrito.value = false

        }, 8000)

    } catch(error){

        console.log(error)

        textoBoton.value = 'Error'

        setTimeout(() => {

            textoBoton.value =
                'Agregar al carrito'

            cargandoCarrito.value = false

        }, 3000)

    }

}

onMounted(() => {

    cargarProducto()

})

const categoriaProducto = computed(() => {

    if(!producto.value?.categorias) return ''

    return producto.value.categorias
        .map(cat => cat.ncm_cat)
        .join(' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

})

const esFunda = computed(() => {

    return categoriaProducto.value.includes('funda')

})

const esVitral = computed(() => {

    return categoriaProducto.value.includes('vitral')

})

const esRopa = computed(() => {

    return categoriaProducto.value.includes('sudadera') ||
           categoriaProducto.value.includes('ropa') ||
           categoriaProducto.value.includes('playera') ||
           categoriaProducto.value.includes('pantalon') ||
           categoriaProducto.value.includes('short')

})

</script>

<template>

<div
    v-if="producto"
    class="container py-5"
>

    <div class="row">

        <!-- IMAGEN -->
        <div class="col-md-6 text-center">

            <img

                :src="`${import.meta.env.VITE_API_URL.replace('/api','')}/storage/${producto.imagen}`"

                class="img-fluid rounded shadow"

                style="
                    max-height:450px;
                    object-fit:cover;
                "
            >

        </div>

        <!-- INFO -->
        <div class="col-md-6">

            <h2 class="mb-3">

                {{ producto.nombre }}

            </h2>

            <!-- ESTRELLAS -->
            <div class="mb-2">

                <span

                    v-for="n in 5"

                    :key="n"

                    :style="{

                        color:
                            n <= Math.round(promedio)
                                ? '#ffc107'
                                : '#ccc'

                    }"

                >
                    ★
                </span>

                <span class="ms-2 text-muted">

                    {{ promedio }}

                </span>

            </div>

            <!-- PRECIO -->
            <h3 class="text-success mb-3">

                ${{ Number(producto.Precio_uni).toLocaleString(
                    'es-MX',
                    {
                        minimumFractionDigits: 2
                    }
                ) }} MXN

            </h3>

            <!-- DESC -->
            <p class="text-muted">

                {{ producto.descripcion }}

            </p>

            <!-- CANTIDAD -->
            <div class="mb-3">

                <label class="form-label">
                    Cantidad
                </label>

                <input

                    v-model="cantidad"

                    type="number"

                    min="1"

                    class="form-control"

                    style="max-width:120px;"
                >

            </div>

            <!-- BOTONES -->
            <div class="d-flex gap-2">

                <button
                    id="btnCarrito"
                    @click="mostrarModal = true"
                    :disabled="cargandoCarrito"
                >
                    {{ textoBoton }}
                </button>
                

                <!-- FAVORITO -->
                <button

                    v-if="usuario"

                    @click="toggleFavorito"

                    class="btn"

                    :class="

                        esFavorito
                            ? 'btn-outline-danger'
                            : 'btn-outline-secondary'

                    "

                >

                    {{ esFavorito ? '❤️' : '🤍' }}

                </button>

            </div>

        </div>

    </div>

    

    <!-- COMENTARIOS -->
    <hr class="my-5">

    <h4 class="mb-4">
        Comentarios
    </h4>

    <!-- LISTA -->
    <div
        v-for="comentarioItem in producto.comentarios"
        :key="comentarioItem.ID_com"
        class="card mb-3 shadow-sm"
        style="border-radius:15px;"
    >

        <div class="card-body position-relative">

            <strong>

                {{ comentarioItem.usuario?.nombre }}

            </strong>

            <!-- ADMIN ELIMINAR -->
            <div
                v-if="usuario && usuario.ID_rol == 1"
                class="dropdown-comentario"
            >

                <button
                    class="btn-puntos"
                    @click="
                        comentarioMenu =
                            comentarioMenu === comentarioItem.ID_com
                                ? null
                                : comentarioItem.ID_com
                    "
                >
                    ⋮
                </button>

                <div
                    v-if="comentarioMenu === comentarioItem.ID_com"
                    class="menu-comentario"
                >

                    <button
                        @click="abrirEliminarComentario(comentarioItem.ID_com)"
                        class="opcion-eliminar"
                    >
                        🗑 Eliminar
                    </button>

                </div>

            </div>

            <div>

                <span

                    v-for="n in 5"

                    :key="n"

                    :style="{

                        color:
                            n <= comentarioItem.calificacion
                                ? '#ffc107'
                                : '#ccc'

                    }"

                >
                    ★
                </span>

            </div>

            <p class="mt-2 mb-0">

                {{ comentarioItem.comentario }}

            </p>

        </div>

    </div>

    <!-- AGREGAR -->
    <div
        v-if="usuario && usuario.ID_rol != 1"
        class="card p-3 shadow-sm"
        style="border-radius:15px;"
    >

        <!-- ESTRELLAS -->
        <div class="mb-3">

            <span

                v-for="n in 5"

                :key="n"

                @click="seleccionarEstrella(n)"

                style="
                    font-size:24px;
                    cursor:pointer;
                "

                :style="{

                    color:
                        n <= calificacion
                            ? '#ffc107'
                            : '#ccc'

                }"

            >
                ★
            </span>

        </div>

        <div class="d-flex">

            <input

                v-model="comentario"

                type="text"

                class="form-control me-2"

                placeholder="Escribe tu comentario..."

            >

            <button

                @click="enviarComentario"

                class="btn btn-dark"

            >
                ➤
            </button>

        </div>

    </div>

<!-- MODAL PERSONALIZACIÓN -->
    <div
        v-if="mostrarModal"
        class="modal-personalizacion"
    >

    <div class="modal-card">

        <h4>Detalles del pedido</h4>

    <p class="text-muted">
        Agrega las especificaciones necesarias para personalizar tu producto.
    </p>

    <!-- FUNDA -->
    <div v-if="esFunda">

        <div class="mb-3">
            <label>Modelo de teléfono</label>
            <input
                v-model="personalizacion.modeloTelefono"
                class="form-control"
                placeholder="Ej. iPhone 13, Samsung A54..."
            >
        </div>

        <div class="mb-3">
            <label>Tipo de funda</label>
            <select
                v-model="personalizacion.materialFunda"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Transparente">Transparente</option>
            </select>
        </div>

        <div class="mb-3">
            <label>Acabado</label>
            <select
                v-model="personalizacion.acabadoFunda"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Brillante">Brillante</option>
                <option value="Mate">Mate</option>
            </select>
        </div>

    </div>

    <!-- VITRAL -->
    <div v-if="esVitral">

        <div class="mb-3">

            <label>Tamaño del vitral (cm)</label>

            <input
                v-model="personalizacion.tamanoVitral"
                type="text"
                class="form-control"
                placeholder="Ej. 20x30 cm, 45x60 cm..."
            >

            <small class="text-muted">
                Especifica las medidas aproximadas en centímetros.
            </small>

        </div>

        <div class="mb-3">
            <label>Forma del vitral</label>
            <select
                v-model="personalizacion.formaVitral"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Cuadrado">Cuadrado</option>
                <option value="Rectangular">Rectangular</option>
                <option value="Circular">Circular</option>
            </select>
        </div>

        <div class="mb-3">
            <label>Tipo de instalación</label>
            <select
                v-model="personalizacion.tipoInstalacion"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Solo pieza de vidrio">Solo pieza de vidrio</option>
            </select>
        </div>

    </div>

    <!-- ROPA -->
    <div v-if="esRopa">

        <div class="mb-3">
            <label>Tipo de prenda</label>
            <select
                v-model="personalizacion.tipoPrenda"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Sudadera sin gorro">Sudadera sin gorro</option>
                <option value="Playera">Playera</option>
                <option value="Pantalón">Pantalón</option>
                <option value="Short">Short</option>
            </select>
        </div>

        <div class="row">

            <div class="col-md-6 mb-3">
                <label>Color</label>
                <input
                    v-model="personalizacion.color"
                    class="form-control"
                    placeholder="Ej. negro, blanco, azul..."
                >
            </div>

            <div class="col-md-6 mb-3">
                <label>Talla</label>
                <select
                    v-model="personalizacion.talla"
                    class="form-control"
                >
                    <option value="">Seleccionar</option>
                    <option value="CH">CH</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="EG">EG</option>
                </select>
            </div>

        </div>

        <div class="mb-3">
            <label>Ubicación del diseño</label>
            <select
                v-model="personalizacion.ubicacionDiseno"
                class="form-control"
            >
                <option value="">Seleccionar</option>
                <option value="Frente">Frente</option>
                <option value="Espalda">Espalda</option>
                <option value="Manga">Manga</option>
                <option value="Pierna">Pierna</option>
            </select>
        </div>

    </div>

    <!-- NOTAS -->
    <div class="mb-3">
        <label>Notas adicionales</label>
        <textarea
            v-model="personalizacion.notas"
            class="form-control"
            placeholder="Especifica algún detalle extra..."
        ></textarea>
    </div>

    <div class="d-flex justify-content-end gap-2">

        <button
            class="btn btn-light"
            @click="mostrarModal = false"
        >
            Cancelar
        </button>

        <button
            class="btn-confirmar"
            @click="agregarCarrito"
        >
            Confirmar y agregar
        </button>

    </div>

    </div>

</div>

<!-- TOAST GARASUATO -->
<div
    v-if="mostrarToast"
    class="toast-gara"
    :class="toastTipo"
>
    {{ toastMensaje }}
</div>

<!-- MODAL ELIMINAR COMENTARIO -->
<div
    v-if="mostrarModalEliminar"
    class="modal-overlay"
>

    <div class="modal-card">

        <h4 class="mb-3">
            ¿Eliminar comentario?
        </h4>

        <p class="text-muted">
            Esta acción no se puede deshacer.
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
                @click="eliminarComentario"
            >
                Eliminar
            </button>

        </div>

    </div>

</div>



</div>

</template>

<style scoped>

.btn-dark{

    background:#192718;
    border:none;

}

.btn-dark:hover{

    background:#cae2e6;
    color:#192718;

}

#btnCarrito {
    background: #192718;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 10px 24px;
    font-weight: 600;
    transition: all 0.3s ease;
}

#btnCarrito:hover {
    background: #cae2e6;
    color: #192718;
}

#btnCarrito:disabled {
    opacity: 1;
    cursor: not-allowed;
    background: #cae2e6;
    color: #192718;
}

.modal-personalizacion{
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
    width:95%;
    max-width:600px;
    padding:30px;
    border-radius:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.2);
}

.btn-confirmar{
    background:#192718;
    color:white;
    border:none;
    border-radius:12px;
    padding:10px 22px;
    font-weight:600;
}

.btn-confirmar:hover{
    background:#cae2e6;
    color:#192718;
}

.toast-gara{

    position:fixed;

    top:20px;
    right:20px;

    padding:14px 20px;

    border-radius:14px;

    font-weight:600;

    z-index:99999;

    box-shadow:
        0 5px 20px rgba(0,0,0,.12);

}

.toast-gara.success{

    background:#9edee9;

    color:#192718;

}

.toast-gara.warning{

    background:#cae2e6;

    color:#192718;

}

.toast-gara.error{

    background:#192718;

    color:white;

}

.dropdown-comentario{

    position:absolute;

    top:10px;
    right:10px;

}

.btn-puntos{

    background:none;

    border:none;

    font-size:22px;

    color:#888;

    cursor:pointer;

    transition:.2s ease;

}

.btn-puntos:hover{

    color:#192718;

    transform:scale(1.1);

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

.menu-comentario{

    position:absolute;

    top:32px;
    right:0;

    background:white;

    border-radius:12px;

    min-width:140px;

    box-shadow:
        0 6px 18px rgba(0,0,0,.15);

    overflow:hidden;

    z-index:1000;

}

.menu-comentario button{

    width:100%;

    border:none;

    background:white;

    padding:10px 14px;

    text-align:left;

    font-size:14px;

}

.opcion-eliminar{

    color:#dc3545;

}

.opcion-eliminar:hover{

    background:#f8f9fa;

}

</style>