<script setup>

import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const favoritos = ref([])

const cargarFavoritos = async () => {

    try {

        const response =
            await api.get('/favoritos')

        favoritos.value =
            response.data.favoritos ?? response.data

    } catch(error){

        console.log(error)

    }

}

const quitarFavorito = async (ID_prod) => {

    try {

        await api.delete(
            `/favoritos/${ID_prod}`
        )

        favoritos.value =
            favoritos.value.filter(

                producto =>
                    producto.ID_prod !== ID_prod

            )

    } catch(error){

        console.log(error)

    }

}

const imagenProducto = (imagen) => {

    if(!imagen) return ''

    if(imagen.startsWith('http')){

        return imagen

    }

    return `${import.meta.env.VITE_API_URL.replace('/api','')}/storage/${props.producto.imagen}`

}

onMounted(() => {

    cargarFavoritos()

})

</script>

<template>

<div class="container py-5">

    <div class="titulo-garasuato">
        Productos guardados
    </div>

    <p
        v-if="favoritos.length == 0"
        class="vacio"
    >
        Aún no has guardado productos a tus favoritos.
    </p>

    <div class="grid-favoritos">

        <div
            v-for="producto in favoritos"
            :key="producto.ID_prod"
            class="card-favorito"
        >

            <RouterLink
                :to="`/producto/${producto.ID_prod}`"
            >

                <img
                    :src="imagenProducto(producto.imagen)"
                    class="img-favorito"
                >

            </RouterLink>

            <div class="info-favorito">

                <div class="precio-favorito">

                    {{
                        Number(producto.Precio_uni)
                        .toLocaleString(
                            'es-MX',
                            {
                                style:'currency',
                                currency:'MXN'
                            }
                        )
                    }}

                </div>

                <button
                    class="btn-quitar"
                    @click="quitarFavorito(producto.ID_prod)"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>

.titulo-garasuato{
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    color:#192718;
    margin-bottom:40px;
    letter-spacing:1px;
}

.grid-favoritos{
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
    gap:25px;
}

.card-favorito{
    background:none;
    border-radius:4px;
    overflow:hidden;
    transition:0.2s ease;
}

.card-favorito:hover{
    transform: translateY(-3px);
}

.img-favorito{
    width:100%;
    height:230px;
    object-fit:cover;
    border-radius:10px;
    transition:0.3s ease;
}

.img-favorito:hover{
    transform:scale(1.03);
    opacity:0.9;
}

.info-favorito{
    padding-top:8px;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.precio-favorito{
    font-family:'Playfair Display', serif;
    font-size:18px;
    color:#6bb7c9;
}

.btn-quitar{
    background:none;
    border:none;
    padding:0;
    font-size:16px;
    color:#9a9a9a;
    cursor:pointer;
    transition:0.2s ease;
}

.btn-quitar:hover{
    color:#c97b7b;
}

.vacio{
    color:#7a7a7a;
    font-size:15px;
}

</style>