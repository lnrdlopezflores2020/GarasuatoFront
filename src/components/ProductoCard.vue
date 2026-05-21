<script setup>

import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../services/api'

const props = defineProps({

    producto: Object

})

const router = useRouter()

const usuario = computed(() => {

    return JSON.parse(
        localStorage.getItem('usuario') || 'null'
    )

})

const marcadoFavorito = ref(

    props.producto.es_favorito ?? false

)

const imagenProducto = computed(() => {

    if (!props.producto.imagen) {

        return '/img/no-image.png'

    }

    if (props.producto.imagen.startsWith('http')) {

        return props.producto.imagen

    }

    return `${import.meta.env.VITE_API_URL.replace('/api','')}/storage/${props.producto.imagen}`

})

const toggleFavorito = async () => {

    if(!usuario.value){

        router.push('/login')

        return

    }

    try {

        if(marcadoFavorito.value){

            await api.delete(

                `/favoritos/${props.producto.ID_prod}`

            )

            marcadoFavorito.value = false

        } else {

            await api.post(

                `/favoritos/${props.producto.ID_prod}`

            )

            marcadoFavorito.value = true

        }

    } catch(error){

        console.log(error)

    }

}

</script>

<template>

<div class="card producto-card border-0 h-100">

    <RouterLink
        :to="`/producto/${producto.ID_prod}`"
        class="text-decoration-none"
    >

        <div class="img-container">

            <img
                :src="imagenProducto"
                class="img-fluid producto-img"
            />

        </div>

    </RouterLink>

    <div class="card-body p-3">

        <h6 class="producto-titulo">

            {{ producto.nombre }}

        </h6>

        <p class="producto-descripcion">

            {{ producto.descripcion }}

        </p>

        <div
            class="d-flex justify-content-between align-items-center mt-2"
        >

            <span class="precio">

                ${{ Number(producto.Precio_uni).toLocaleString(
                    'es-MX',
                    {
                        minimumFractionDigits: 2
                    }
                ) }} MXN

            </span>

            <button
                class="favorito-btn"
                @click.stop="toggleFavorito"
            >
                {{ marcadoFavorito ? '❤️' : '🤍' }}
            </button>

        </div>

    </div>

</div>

</template>

<style scoped>

.producto-card{

    border-radius:20px;

    overflow:hidden;

    transition:.25s ease;

    background:white;

    box-shadow:
        0 5px 18px rgba(0,0,0,.06);

}

.producto-card:hover{

    transform:translateY(-4px);

    box-shadow:
        0 12px 25px rgba(0,0,0,.10);

}

.img-container{

    width:100%;
    height:240px;

    overflow:hidden;

    background:#f8f8f8;

}

.producto-img{

    width:100%;
    height:100%;

    object-fit:cover;

    transition:.3s ease;

}

.producto-card:hover .producto-img{

    transform:scale(1.04);

}

.producto-titulo{

    font-weight:700;

    color:#192718;

    margin-bottom:6px;

    font-size:15px;

}

.producto-descripcion{

    color:#666;

    font-size:13px;

    min-height:40px;

    margin-bottom:0;

}

.precio{

    font-size:18px;

    font-weight:bold;

    color:#192718;

}

.favorito-btn{

    width:38px;
    height:38px;

    border:none;

    border-radius:50%;

    background:#f3f3f3;

    transition:.2s ease;

}

.favorito-btn:hover{

    background:#cae2e6;

    transform:scale(1.08);

}

</style>