<script setup>

import { ref } from 'vue'
import api from '../../services/api'

const cargando = ref(false)
const mensaje = ref('')
const error = ref('')
const archivo = ref('')

const generarBackup = async () => {

    cargando.value = true
    mensaje.value = ''
    error.value = ''
    archivo.value = ''

    try {

        const response =
            await api.post('/admin/backup/generar')

        mensaje.value =
            response.data.message

        archivo.value =
            response.data.archivo

    } catch(err){

        console.log(err)

        error.value =
            'No se pudo generar el respaldo'

    } finally {

        cargando.value = false

    }

}

const descargarBackup = async () => {

    try {

        const response = await api.get(
            `/admin/backup/descargar/${archivo.value}`,
            {
                responseType: 'blob'
            }
        )

        const url =
            window.URL.createObjectURL(
                new Blob([response.data])
            )

        const link =
            document.createElement('a')

        link.href = url

        const fecha = new Date()

        const nombrePersonalizado =
            `Garasuato_backup_${
                fecha.getFullYear()
            }.sql`

        link.setAttribute(
            'download',
            nombrePersonalizado
        )

        document.body.appendChild(link)

        link.click()

        link.remove()

    } catch(error){

        console.log(error)

        error.value =
            'No se pudo descargar el respaldo'

    }

}

</script>

<template>

<div class="container py-5">

    <div class="backup-card mx-auto">

        <h2 class="titulo">
            Respaldo de Base de Datos
        </h2>

        <p class="subtitulo">
            Genera una copia de seguridad de la base de datos de GARASUATO.
        </p>

        <button
            @click="generarBackup"
            class="btn-backup"
            :disabled="cargando"
        >
            {{ cargando ? 'Generando respaldo...' : 'Crear respaldo' }}
        </button>

        <div
            v-if="mensaje"
            class="alert alert-success mt-4"
        >
            {{ mensaje }}
        </div>

        <div
            v-if="error"
            class="alert alert-danger mt-4"
        >
            {{ error }}
        </div>

        <button
            v-if="archivo"
            @click="descargarBackup"
            class="btn-download mt-3"
        >
            Descargar respaldo
        </button>

    </div>

</div>

</template>

<style scoped>

.backup-card{
    max-width:650px;
    background:white;
    padding:40px;
    border-radius:25px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
    text-align:center;
}

.titulo{
    color:#192718;
    font-weight:700;
}

.subtitulo{
    color:#777;
    margin-bottom:30px;
}

.btn-backup,
.btn-download{
    width:100%;
    border:none;
    background:#cae2e6;
    color:#192718;
    padding:14px;
    border-radius:14px;
    font-weight:bold;
    transition:.2s;
}

.btn-backup:hover,
.btn-download:hover{
    background:#b8dbe0;
}

.btn-backup:disabled{
    opacity:.7;
}

</style>