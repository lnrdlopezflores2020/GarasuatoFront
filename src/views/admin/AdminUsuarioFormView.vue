<script setup>

import {

    reactive,
    ref,
    watch,
    computed,
    onMounted

} from 'vue'

import {

    useRouter,
    useRoute

} from 'vue-router'

import api from '../../services/api'

const router = useRouter()

const route = useRoute()

const colonias = ref([])

const error = ref('')

const success = ref('')

const editando = computed(() => {

    return !!route.params.id

})

const form = reactive({

    nombre: '',
    ape_pat: '',
    ape_mat: '',
    correo: '',
    contrasena: '',
    telefono: '',
    estado: '',
    municipio: '',
    CP: '',
    colonia: '',
    calle: '',
    num_ext: '',
    num_int: '',
    ID_rol: 2

})

const cargarUsuario = async () => {

    try {

        const response = await api.get(

            `/admin/usuarios/${route.params.id}`

        )

        Object.assign(
            form,
            response.data.usuario
        )

        form.contrasena = '........'

    } catch(error){

        console.log(error)

    }

}

const guardarUsuario = async () => {

    error.value = ''

    success.value = ''

    try {

        const dataEnviar = {

            ...form

        }

        // NO actualizar password fake
        if(
            editando.value
            &&
            form.contrasena === '........'
        ){

            delete dataEnviar.contrasena

        }

        if(editando.value){

            await api.put(

                `/admin/usuarios/${route.params.id}`,

                dataEnviar

            )

            success.value =
                'Usuario actualizado'

        } else {

            await api.post(

                '/admin/usuarios',

                dataEnviar

            )

            success.value =
                'Usuario creado'

        }

        setTimeout(() => {

            router.push(
                '/admin/usuarios'
            )

        }, 1500)

    } catch(error){

        console.log(error)

        error.value =
            'No se pudo guardar'

    }

}

watch(() => form.CP, async (nuevoCP) => {

    if(nuevoCP.length !== 5) return

    try {

        const token =
            'dd5b86b0-e579-496e-9896-72cd5cbe383a'

        const response = await fetch(

            `https://api.copomex.com/query/info_cp/${nuevoCP}?type=simplified&token=${token}`

        )

        const data = await response.json()

        if(data.error) return

        form.estado =
            data.response.estado

        form.municipio =
            data.response.municipio

        colonias.value =
            data.response.asentamiento

    } catch(error){

        console.log(error)

    }

})

onMounted(() => {

    if(editando.value){

        cargarUsuario()

    }

})

</script>

<template>

<div class="container py-5">

    <div class="register-card mx-auto">

        <h2 class="mb-4 text-center">

            {{ editando
                ? 'Editar Usuario'
                : 'Nuevo Usuario'
            }}

        </h2>

        <!-- NOMBRES -->
        <div class="row">

            <div class="col-md-4 mb-3">

                <label>Nombre</label>

                <input
                    v-model="form.nombre"
                    class="form-control"
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Apellido Paterno</label>

                <input
                    v-model="form.ape_pat"
                    class="form-control"
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Apellido Materno</label>

                <input
                    v-model="form.ape_mat"
                    class="form-control"
                >

            </div>

        </div>

        <!-- CORREO -->
        <div class="row">

            <div class="col-md-6 mb-3">

                <label>Correo</label>

                <input
                    v-model="form.correo"
                    type="email"
                    class="form-control"
                >

            </div>

            <div class="col-md-6 mb-3">

                <label>Contraseña</label>

                <input
                    v-model="form.contrasena"
                    type="password"
                    class="form-control"
                >

            </div>

        </div>

        <!-- TELEFONO -->
        <div class="mb-3">

            <label>Teléfono</label>

            <input
                v-model="form.telefono"
                class="form-control"
            >

        </div>

        <!-- CP -->
        <div class="row">

            <div class="col-md-4 mb-3">

                <label>CP</label>

                <input
                    v-model="form.CP"
                    class="form-control"
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Estado</label>

                <input
                    v-model="form.estado"
                    class="form-control"
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Municipio</label>

                <input
                    v-model="form.municipio"
                    class="form-control"
                >

            </div>

        </div>

        <!-- COLONIA -->
        <div class="mb-3">

            <label>Colonia</label>

            <select
                v-model="form.colonia"
                class="form-select"
            >

                <option value="">
                    Selecciona
                </option>

                <option
                    v-for="col in colonias"
                    :key="col"
                    :value="col"
                >
                    {{ col }}
                </option>

            </select>

        </div>

        <!-- DIRECCION -->
        <div class="row">

            <div class="col-md-8 mb-3">

                <label>Calle</label>

                <input
                    v-model="form.calle"
                    class="form-control"
                >

            </div>

            <div class="col-md-2 mb-3">

                <label>No. Ext</label>

                <input
                    v-model="form.num_ext"
                    class="form-control"
                >

            </div>

            <div class="col-md-2 mb-3">

                <label>No. Int</label>

                <input
                    v-model="form.num_int"
                    class="form-control"
                >

            </div>

        </div>

        <!-- ROL -->
        <div class="mb-4">

            <label>Rol</label>

            <select
                v-model="form.ID_rol"
                class="form-select"
            >

                <option :value="1">
                    Administrador
                </option>

                <option :value="2">
                    Cliente
                </option>

            </select>

        </div>

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

        <button
            @click="guardarUsuario"
            class="btn btn-register w-100"
        >

            {{ editando
                ? 'Actualizar Usuario'
                : 'Crear Usuario'
            }}

        </button>

    </div>

</div>

</template>

<style scoped>

.register-card{

    max-width:900px;

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

.btn-register{

    background:#cae2e6;

    border:none;

    padding:14px;

    border-radius:14px;

    font-weight:bold;

}

</style>