<script setup>

import { reactive, ref, onMounted } from 'vue'
import api from '../services/api'

const usuario = reactive({

    nombre:'',
    ape_pat:'',
    ape_mat:'',
    nom_comp:'',
    correo:'',
    telefono:'',
    estado:'',
    municipio:'',
    CP:'',
    colonia:'',
    calle:'',
    num_ext:'',
    num_int:'',
    ID_rol:'',
    foto_perfil:''

})

const success = ref('')
const error = ref('')

const previewFoto = ref('')

const editandoTelefono = ref(false)

const telefonoTemp = ref('')

const cargarPerfil = async () => {

    try {

        const localUser = JSON.parse(
            localStorage.getItem('usuario')
        )

        if(localUser){

            Object.assign(
                usuario,
                localUser
            )

        }

        const response = await api.get('/perfil')

        Object.assign(
            usuario,
            response.data.usuario
        )

        localStorage.setItem(

            'usuario',

            JSON.stringify(
                response.data.usuario
            )

        )

        window.dispatchEvent(
            new Event('usuarioActualizado')
        )

    } catch(err){

        console.log(err)

    }

}

const toggleTelefono = async () => {

    if(!editandoTelefono.value){

        telefonoTemp.value =
            usuario.telefono

        editandoTelefono.value = true

        return

    }

    try {

        const response = await api.put(

            '/perfil',

            {

                telefono: telefonoTemp.value

            }

        )

        usuario.telefono =
            telefonoTemp.value

        localStorage.setItem(

            'usuario',

            JSON.stringify(usuario)

        )

        success.value =
            response.data.message

        editandoTelefono.value = false

    } catch(err){

        console.log(err)

        error.value =
            'No se pudo actualizar'

    }

}

const cambiarFoto = async (event) => {

    const archivo =
        event.target.files[0]

    if(!archivo) return

    previewFoto.value =
        URL.createObjectURL(archivo)

    const formData = new FormData()

    formData.append(
        'foto',
        archivo
    )

    try {

        const response = await api.post(

            '/perfil/foto',

            formData,

            {

                headers: {

                    'Content-Type':
                    'multipart/form-data'

                }

            }

        )

        usuario.foto_perfil =
            response.data.foto

        localStorage.setItem(

            'usuario',

            JSON.stringify(usuario)

        )

        window.dispatchEvent(
            new Event('storage')
        )

        success.value =
            'Foto actualizada'

    } catch(err){

        console.log(err)

        error.value =
            'No se pudo actualizar la foto'

    }

}

onMounted(() => {

    cargarPerfil()

})

</script>

<template>

<div class="container py-5">

    <div class="perfil-card mx-auto">

        <!-- FOTO -->

        <div class="text-center">

            <div class="foto-wrapper mx-auto">

                <img

                    v-if="
                        previewFoto ||
                        usuario.foto_perfil
                    "

                    :src="

                        previewFoto ||

                        usuario.foto_perfil

                    "

                <div
                    v-else
                    class="sin-foto"
                >
                    👤
                </div>

                <label
                    for="foto"
                    class="editar-foto"
                >
                    ✏️
                </label>

                <input
                    id="foto"
                    type="file"
                    class="d-none"
                    @change="cambiarFoto"
                >

            </div>

            <h3 class="mt-3">

                {{ usuario.nom_comp }}

            </h3>

            <p class="text-muted">

                {{ usuario.ID_rol == 1 ? 'Administrador' : 'Cliente' }}

            </p>

        </div>

        <hr>

        <!-- ALERTAS -->

        <div
            v-if="success"
            class="alert alert-success"
        >
            {{ success }}
        </div>

        <div
            v-if="error"
            class="alert alert-danger"
        >
            {{ error }}
        </div>

        <!-- DATOS -->

        <ul class="list-group list-group-flush text-start">

            <li class="list-group-item">

                <strong>Correo:</strong>

                {{ usuario.correo }}

            </li>

            <li
                class="list-group-item d-flex justify-content-between align-items-center"
            >

                <div>

                    <strong>Teléfono:</strong>

                    {{ usuario.telefono }}

                </div>

                <i
                    class="bi bi-pencil"
                    style="cursor:pointer"
                    @click="toggleTelefono"
                ></i>

            </li>

            <li
                v-if="editandoTelefono"
                class="list-group-item"
            >

                <div class="d-flex gap-2">

                    <input

                        v-model="telefonoTemp"

                        type="text"

                        class="form-control"

                        maxlength="10"

                    >

                    <button
                        class="btn btn-success"
                        @click="toggleTelefono"
                    >
                        💾
                    </button>

                </div>

            </li>

            <li class="list-group-item">

                <strong>Dirección:</strong>

                <br>

                {{ usuario.calle }}
                #{{ usuario.num_ext }}

                <span v-if="usuario.num_int">

                    Int. {{ usuario.num_int }}

                </span>

                <br>

                {{ usuario.colonia }},
                {{ usuario.municipio }},
                {{ usuario.estado }}

                <br>

                C.P. {{ usuario.CP }}

            </li>

        </ul>

    </div>

</div>

</template>

<style scoped>

.container{
    min-height:100vh;
}

.perfil-card{

    max-width:700px;

    background:white;

    padding:40px;

    border-radius:15px;

    box-shadow:
        0 4px 10px rgba(0,0,0,.15);

}

.foto-wrapper{

    position:relative;

    width:140px;
    height:140px;

}

.foto-perfil{

    width:100%;
    height:100%;

    border-radius:50%;

    object-fit:cover;

}

.sin-foto{

    width:100%;
    height:100%;

    border-radius:50%;

    background:#f3f3f3;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:60px;

}

.editar-foto{

    position:absolute;

    bottom:0;
    right:0;

    width:38px;
    height:38px;

    border-radius:50%;

    background:#1f1f1f;

    color:white;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

}

.list-group-item{

    padding:18px 20px;

}

.form-control{

    border-radius:10px;

}

</style>