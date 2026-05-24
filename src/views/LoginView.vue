<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { RouterLink } from 'vue-router'


const router = useRouter()

const correo = ref('')
const contrasena = ref('')
const error = ref('')

const login = async () => {

    error.value = ''

    try {

        const response = await api.post(

            '/login',

            
                {

                    correo: correo.value,

                    contrasena: contrasena.value

                }
        )

        console.log('RESPUESTA LOGIN:', response.data)
        
        
        console.log(response.data)

        localStorage.setItem(
            'correo',
            correo.value
        )

        // guardar correo temporal
        localStorage.setItem(

            'correo_temp',
            correo.value

        )

        // IR A VERIFICACIÓN 2FA
        window.location.href = '/verificar-2fa'

    } catch (err) {

    console.log('ERROR LOGIN:', err.response?.data || err)

    error.value =
        err.response?.data?.message ||
        'Correo o contraseña incorrectos'

    }
}
</script>

<template>

<MainLayout>

    <div class="container py-5">

        <div
            class="mx-auto shadow p-4 rounded"
            style="
                max-width:450px;
                background:white;
            "
        >

            <div class="text-center mb-4">

                <img
                    src="/gara2.png"
                    class="logo-login"
                >

                <h2 class="mt-3">
                    Iniciar Sesión
                </h2>

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Correo
                </label>

                <input

                    v-model="correo"

                    type="email"

                    class="form-control"

                    placeholder="Ingresa tu correo"

                >

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Contraseña
                </label>

                <input

                    v-model="contrasena"

                    type="password"

                    class="form-control"

                    placeholder="Ingresa tu contraseña"

                >

            </div>

            <div
                v-if="error"
                class="alert alert-danger py-1 px-2"
                style="font-size:13px;"
            >

                {{ error }}

            </div>

            <button

                type="button"

                @click="login"

                class="btn btn-primary w-100"

            >

                Iniciar Sesión

            </button>

            <div class="text-center mt-3">

                <RouterLink
                    to="/register"
                    class="btn btn-outline-primary"
                >
                    Registrarse
                </RouterLink>

            </div>

        </div>

    </div>

</MainLayout>

</template>

