<script setup>

import {
    reactive,
    ref,
    onMounted,
    computed
} from 'vue'

import {
    useRouter,
    useRoute
} from 'vue-router'

import api from '../../services/api'

const router = useRouter()

const route = useRoute()

const editando = computed(() => {

    return !!route.params.id

})

const categorias = ref([])

const preview = ref(null)

const error = ref('')

const success = ref('')

const form = reactive({

    nombre: '',
    descripcion: '',
    Precio_uni: '',
    categorias: [],
    imagen: null

})

const cargarCategorias = async () => {

    try {

        const response =
            await api.get(
                '/admin/productos/categorias'
            )

        categorias.value =
            response.data.categorias

    } catch(error){

        console.log(error)

    }

}

const cargarProducto = async () => {

    try {

        const response =
            await api.get(

                `/admin/productos/${route.params.id}`

            )

        const producto =
            response.data.producto

        form.nombre =
            producto.nombre

        form.descripcion =
            producto.descripcion

        form.Precio_uni =
            producto.Precio_uni

        form.categorias =
            producto.categorias.map(

                c => c.ID_cat

            )

        preview.value =
            producto.imagen_url

    } catch(error){

        console.log(error)

    }

}

const seleccionarImagen = (event) => {

    form.imagen =
        event.target.files[0]

    if(form.imagen){

        preview.value =
            URL.createObjectURL(
                form.imagen
            )

    }

}

const guardarProducto = async () => {

    error.value = ''
    success.value = ''

    try {

        const datos =
            new FormData()

        datos.append(
            'nombre',
            form.nombre
        )

        datos.append(
            'descripcion',
            form.descripcion
        )

        datos.append(
            'Precio_uni',
            form.Precio_uni
        )

        form.categorias.forEach(cat => {

            datos.append(
                'categorias[]',
                cat
            )

        })

        if(form.imagen){

            datos.append(
                'imagen',
                form.imagen
            )

        }

        if(editando.value){

            await api.post(
                `/admin/productos/${route.params.id}`,
                datos,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            success.value =
                'Producto actualizado'

        } else {

            await api.post(
                '/admin/productos',
                datos,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            success.value =
                'Producto agregado'

        }

        setTimeout(() => {

            router.push(
                '/admin/productos'
            )

        }, 1500)

    } catch(error){

        console.log(error.response.data)

error.value =
    error.response.data.message

    }

}

onMounted(async () => {

    await cargarCategorias()

    if(editando.value){

        cargarProducto()

    }

})

</script>

<template>

<div class="container py-4">

    <div class="form-card">

        <h2 class="fw-bold mb-4">

            {{

                editando
                    ? 'Editar producto'
                    : 'Nuevo producto'

            }}

        </h2>

        <!-- NOMBRE -->
        <div class="mb-3">

            <label>
                Nombre
            </label>

            <input
                v-model="form.nombre"
                type="text"
                class="form-control"
            >

        </div>

        <!-- DESC -->
        <div class="mb-3">

            <label>
                Descripción
            </label>

            <textarea
                v-model="form.descripcion"
                class="form-control"
                rows="4"
            ></textarea>

        </div>

        <!-- PRECIO -->
        <div class="mb-3">

            <label>
                Precio
            </label>

            <input
                v-model="form.Precio_uni"
                type="number"
                step="0.01"
                class="form-control"
            >

        </div>

        <!-- CATEGORIAS -->
        <div class="mb-3">

            <label>
                Categorías
            </label>

            <select
                v-model="form.categorias"
                class="form-select"
                multiple
            >

                <option
                    v-for="categoria in categorias"
                    :key="categoria.ID_cat"
                    :value="categoria.ID_cat"
                >

                    {{ categoria.ncm_cat }}

                </option>

            </select>

        </div>

        <!-- IMAGEN -->
        <div class="mb-4">

            <label>
                Imagen
            </label>

            <input
                type="file"
                class="form-control"
                accept="image/*"
                @change="seleccionarImagen"
            >

        </div>

        <!-- PREVIEW -->
        <div
            v-if="preview"
            class="mb-4 text-center"
        >

            <img
                :src="preview"
                class="preview-img"
            >

        </div>

        <!-- ALERTAS -->
        <div
            v-if="error"
            class="alert alert-danger"
        >

            {{ error }}

        </div>

        <div
            v-if="success"
            class="alert alert-success"
        >

            {{ success }}

        </div>

        <!-- BOTON -->
        <button
            @click="guardarProducto"
            class="btn btn-save"
        >

            {{

                editando
                    ? 'Actualizar producto'
                    : 'Guardar producto'

            }}

        </button>

    </div>

</div>

</template>

<style scoped>

.form-card{

    max-width:750px;

    margin:auto;

    background:white;

    padding:40px;

    border-radius:25px;

    box-shadow:
        0 10px 30px rgba(0,0,0,.08);

}

.form-control,
.form-select{

    border-radius:12px;

    padding:12px;

}

.preview-img{

    width:220px;

    height:220px;

    object-fit:cover;

    border-radius:20px;

    box-shadow:
        0 5px 18px rgba(0,0,0,.10);

}

.btn-save{

    width:100%;

    border:none;

    background:#cae2e6;

    padding:14px;

    border-radius:14px;

    font-weight:bold;

}

.btn-save:hover{

    background:#b8dbe0;

}

</style>