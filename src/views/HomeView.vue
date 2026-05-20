<script setup>

import { ref, onMounted } from 'vue'
import api from '../services/api'


import ProductoCard from '../components/ProductoCard.vue'

const productos = ref([])
const categorias = ref([])

onMounted(async () => {

    try {

        const response = await api.get('/productos')

        categorias.value = response.data.categorias

    } catch (error) {

        console.log(error)

    }

})

</script>

<template>

<MainLayout>

    <!-- SECCIONES -->
    <template
        v-for="categoria in categorias"
        :key="categoria.ID_cat"
    >

        <h4 class="separador">
            {{ categoria.ncm_cat }}
        </h4>

        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">

            <div
                class="col"
                v-for="producto in categoria.productos"
                :key="producto.ID_prod"
            >

                <ProductoCard
                    :producto="producto"
                />

            </div>

        </div>

    </template>

</MainLayout>

</template>