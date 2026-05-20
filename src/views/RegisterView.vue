<script setup>

import { reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const colonias = ref([])

const error = ref('')
const success = ref('')

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

    const validarCorreo = computed(() => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(form.correo)

    })

    const validarTelefono = computed(() => {

        return /^\d{10}$/
            .test(form.telefono)

    })

    const validarPassword = computed(() => {

        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/
            .test(form.contrasena)

    })


const registrar = async () => {

    error.value = ''
    success.value = ''

    try {

        const response = await api.post(
            '/register',
            form
        )

        success.value =
            'Cuenta creada correctamente'

        setTimeout(() => {

            window.location.href = '/login'

        }, 2000)

    } catch(error){

        console.log(error.response)

        if(
            error.response.data.errors?.correo
        ){

            error.value =
                'El correo ya está registrado'

        } else {

            error.value =
                'No se pudo registrar'

        }

    }

}

watch(() => form.CP, async (nuevoCP) => {

    console.log('CP escribiéndose:', nuevoCP)

    if(nuevoCP.length !== 5) return

    try {

        const token = 'dd5b86b0-e579-496e-9896-72cd5cbe383a'

        const response = await fetch(

            `https://api.copomex.com/query/info_cp/${nuevoCP}?type=simplified&token=${token}`

        )

        const data = await response.json()

        console.log(
            JSON.stringify(data, null, 2)
        )

        if(data.error){

            return

        }

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

</script>

<template>


<div class="container py-5">

    <div class="register-card mx-auto">

        <div class="text-center mb-4">

            <img
                src="/gara2.png"
                class="logo"
            >

            <h2 class="titulo">
                Crear Cuenta
            </h2>

            <p class="subtitulo">
                Únete al mundo artístico de GARASUATO
            </p>

        </div>

        <!-- NOMBRES -->

        <div class="row">

            <div class="col-md-4 mb-3">

                <label>Nombre</label>

                <input
                    v-model="form.nombre"
                    type="text"
                    maxlength="30"
                    class="form-control"

                    @input="
                        form.nombre =
                        form.nombre.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'')
                    "
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Apellido Paterno</label>

                <input
                    v-model="form.ape_pat"
                    type="text"
                    class="form-control"

                    @input="
                        form.ape_pat =
                        form.ape_pat.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'')
                    "
                >

            </div>

            <div class="col-md-4 mb-3">

                <label>Apellido Materno</label>

                <input
                    v-model="form.ape_mat"
                    type="text"
                    class="form-control"

                    @input="
                        form.ape_mat =
                        form.ape_mat.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'')
                    "
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
                    :class="[
                        'form-control',
                        validarCorreo
                            ? 'is-valid'
                            : 'is-invalid'
                    ]"
                >

                <small
                    v-if="form.correo && !validarCorreo"
                    class="text-danger"
                >
                    Ingresa un correo válido
                </small>

            </div>

            <div class="col-md-6 mb-3">

                <label>Contraseña</label>

                <input
                    v-model="form.contrasena"
                    type="password"
                    :class="[
                        'form-control',
                        validarPassword
                            ? 'is-valid'
                            : 'is-invalid'
                    ]"
                >

                <small
                    v-if="form.contrasena && !validarPassword"
                    class="text-danger"
                >

                    Mínimo 8 caracteres,
                    una mayúscula,
                    una minúscula,
                    un número
                    y un carácter especial

                </small>

                <small
                    v-if="validarPassword"
                    class="text-success"
                >

                    Contraseña segura

                </small>

            </div>

        </div>

        <!-- TELEFONO -->

        <div class="mb-3">

            <label>Teléfono</label>

            <input
                v-model="form.telefono"
                type="text"
                maxlength="10"
                :class="[
                    'form-control',
                    validarTelefono
                        ? 'is-valid'
                        : 'is-invalid'
                ]"
                @input="form.telefono = form.telefono.replace(/\D/g,'')"
            >

            <small
                v-if="form.telefono && !validarTelefono"
                class="text-danger"
            >
                Debe contener 10 números
            </small>
        </div>

        <!-- CP -->

        <div class="row">

            <div class="col-md-4 mb-3">

                <label>Código Postal</label>

                <input
                    v-model="form.CP"
                    type="text"
                    class="form-control"
                    maxlength="5"
                    inputmode="numeric"

                    @input="
                        form.CP =
                        form.CP.replace(/\D/g,'')
                    "
                />

            </div>

            <div class="col-md-4 mb-3">

                <label>Estado</label>

                <input
                    v-model="form.estado"
                    type="text"
                    class="form-control"
                />

            </div>

            <div class="col-md-4 mb-3">

                <label>Municipio</label>

                <input
                    v-model="form.municipio"
                    type="text"
                    class="form-control"
                />

            </div>

        </div>

        <!-- COLONIA -->
        <div class="col-md-2">

            <label class="form-label">
                Colonia
            </label>

            <select
                v-model="form.colonia"
                class="form-select select-grande"
            >

                <option value="">
                    Selecciona una colonia
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
                        type="text"
                        maxlength="50"
                        class="form-control"

                        @input="
                            form.calle =
                            form.calle.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.-]/g,'')
                        "
                    >

            </div>

            <div class="col-md-2 mb-3">

                <label>No. Ext</label>

                <input
                    v-model="form.num_ext"
                    type="text"
                    maxlength="10"
                    class="form-control"

                    @input="
                        form.num_ext =
                        form.num_ext.replace(/[^A-Za-z0-9-]/g,'')
                    "
                >

            </div>

            <div class="col-md-2 mb-3">

                <label>No. Int</label>

                <input
                    v-model="form.num_int"
                    type="text"
                    maxlength="10"
                    class="form-control"

                    @input="
                        form.num_int =
                        form.num_int.replace(/[^A-Za-z0-9-]/g,'')
                    "
                >

            </div>

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
            @click="registrar"
            class="btn btn-register w-100"
        >
            Crear Cuenta
        </button>

        <div class="text-center mt-4">

            <span>
                ¿Ya tienes cuenta?
            </span>

            <RouterLink
                to="/login"
                class="login-link"
            >
                Inicia sesión
            </RouterLink>

        </div>

    </div>

</div>



</template>

<style scoped>

.container{
    min-height:100vh;
}

.register-card{

    max-width:900px;

    background:white;

    padding:40px;

    border-radius:25px;

    box-shadow:
        0 10px 30px rgba(0,0,0,.08);

}

.logo{

    width:110px;
    height:110px;

    object-fit:cover;

    border-radius:50%;

    margin-bottom:20px;

}

.titulo{

    color:#192718;

    font-weight:bold;

}

.subtitulo{

    color:#777;

}

.form-control,
.form-select{

    border-radius:12px;

    padding:12px;

}

.select-grande{

    min-width: 590px;
    height: 50px;
    font-size: 16px;
    border-radius: 12px;

}

.select-grande:focus{

    border-color:#cae2e6;
    box-shadow:0 0 0 4px rgba(202,226,230,.35);
}

.btn-register{

    background:#cae2e6;

    border:none;

    padding:14px;

    border-radius:14px;

    font-weight:bold;

    transition:.2s;

}

.btn-register:hover{

    background:#b8dbe0;

}

.login-link{

    margin-left:5px;

    color:#234030;

    font-weight:bold;

    text-decoration:none;

}

.login-link:hover{

    text-decoration:underline;

}

</style>