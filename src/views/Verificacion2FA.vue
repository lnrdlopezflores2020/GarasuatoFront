<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'


const router = useRouter()

const correo = localStorage.getItem('correo')

const codigo = ref('')

const mensaje = ref('')
const error = ref('')


const verificarCodigo = async () => {

    error.value = ''
    mensaje.value = ''

    try {

        const response = await api.post(

            '/verificar-2fa',

           
            {

                correo: localStorage.getItem('correo'),

                codigo: codigo.value

            }
            


        )

        // GUARDAR TOKEN
        localStorage.setItem(

            'token',

            response.data.token

        )

        // GUARDAR USUARIO COMPLETO
        localStorage.setItem(

            'usuario',

            JSON.stringify(
                response.data.usuario
            )

        )

        window.dispatchEvent(
            new Event('usuarioActualizado')
        )


        // AGREGAR TOKEN GLOBAL A AXIOS
        api.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${response.data.token}`

        // REDIRECCIÓN
        router.push('/')

    } catch(error){

        console.log(error)

    }

}



const reenviarCodigo = async () => {

    error.value = ''
    mensaje.value = ''

    try {

        const response = await api.post(

            '/reenviar-2fa',

            {
                correo: correo
            }

        )

        mensaje.value =
            response.data.message

    } catch (err) {

        console.log(err)

        error.value =
            'No se pudo reenviar el código'

    }

}

</script>

<template>
<MainLayout>

<div class="container-verificacion">

    <div class="card-verificacion">

        <img
            src="/gara2.png"
            class="logo"
        >

        <h2>
            Verificación GARASUATO
        </h2>

        <p>
            Ingresa el código enviado a tu correo
        </p>

        <input
            v-model="codigo"
            type="text"
            maxlength="6"
            placeholder="______"
            class="input-code"
        >

        <div
            v-if="error"
            class="alert alert-danger mt-3"
        >
            {{ error }}
        </div>

        <div
            v-if="mensaje"
            class="alert alert-success mt-3"
        >
            {{ mensaje }}
        </div>

        <button
            @click="verificarCodigo"
            class="btn-verificar"
        >
            Verificar
        </button>

        <div class="reenviar-box">

            <p>
                ¿No recibiste el código?
            </p>

            <button
                @click="reenviarCodigo"
                class="btn-reenviar"
            >
                Reenviar código
            </button>

        </div>

    </div>

</div>

</MainLayout>
</template>

<style scoped>

.container-verificacion{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f7f7f7;
}

.card-verificacion{
    background:white;
    padding:40px;
    border-radius:20px;
    width:400px;
    text-align:center;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
}

.logo{
    width:110px;
    height:110px;
    margin-bottom:20px;
    border-radius:50%;
    object-fit:cover;
}

h2{
    color:#192718;
    margin-bottom:10px;
}

p{
    color:#666;
    margin-bottom:25px;
}

.input-code{
    width:100%;
    padding:15px;
    font-size:24px;
    text-align:center;
    border-radius:12px;
    border:1px solid #ddd;
    letter-spacing:8px;
    margin-bottom:20px;
}

.btn-verificar{
    width:100%;
    border:none;
    background:#cae2e6;
    padding:14px;
    border-radius:12px;
    font-weight:bold;
    transition:.2s;
}

.btn-verificar:hover{
    background:#b7d8dd;
}

.reenviar-box{
    margin-top:25px;
}

.btn-reenviar{
    background:none;
    border:none;
    color:#192718;
    font-weight:bold;
    text-decoration:underline;
    cursor:pointer;
}

</style>