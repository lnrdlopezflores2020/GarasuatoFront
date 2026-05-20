<script setup>

import {
    ref,
    onMounted
} from 'vue'

import {
    Bar,
    Line
} from 'vue-chartjs'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from 'chart.js'

import api from '../../services/api'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
)

const usuariosChart = ref(null)

const ventasChart = ref(null)

const prediccion = ref(0)

const totalVentas = ref(0)

const totalUsuarios = ref(0)

const cargarDashboard = async () => {

    try {

        // USUARIOS
        const usuarios =
            await api.get(
                '/admin/dashboard/usuarios-mes'
            )

        totalUsuarios.value =
            usuarios.data.data.reduce(

                (acc, item) =>
                    acc + item.total,

                0
            )

        usuariosChart.value = {

            labels:
                usuarios.data.data.map(
                    item => item.mes
                ),

            datasets: [

                {
                    label: 'Usuarios registrados',

                    data:
                        usuarios.data.data.map(
                            item => item.total
                        ),

                    backgroundColor:
                        '#cae2e6'
                }

            ]

        }

        // VENTAS
        const ventas =
            await api.get(
                '/admin/dashboard/ventas-mes'
            )

        totalVentas.value =
            ventas.data.data.reduce(

                (acc, item) =>
                    acc + Number(item.total_ventas),

                0
            )

        ventasChart.value = {

            labels:
                ventas.data.data.map(
                    item => item.mes
                ),

            datasets: [

                {
                    label: 'Ventas mensuales',

                    data:
                        ventas.data.data.map(
                            item => item.total_ventas
                        ),

                    borderColor:
                        '#192718',

                    backgroundColor:
                        '#192718',

                    tension: 0.3
                }

            ]

        }

        // PREDICCION
        const pred =
            await api.get(
                '/admin/dashboard/prediccion-compras'
            )

        prediccion.value =
            pred.data.prediccion

    } catch(error){

        console.log(error)

    }

}

onMounted(() => {

    cargarDashboard()

})

</script>

<template>

<div class="container py-4">

    <h2 class="fw-bold mb-4">
        Dashboard GARASUATO
    </h2>

    <!-- TARJETAS -->
    <div class="row mb-4">

        <div class="col-md-4">

            <div class="card-dashboard">

                <h5>
                    Usuarios registrados
                </h5>

                <h2>
                    {{ totalUsuarios }}
                </h2>

            </div>

        </div>

        <div class="col-md-4">

            <div class="card-dashboard">

                <h5>
                    Ventas totales
                </h5>

                <h2>

                    ${{
                        Number(totalVentas)
                        .toLocaleString(
                            'es-MX',
                            {
                                minimumFractionDigits:2
                            }
                        )
                    }}

                </h2>

            </div>

        </div>

        <div class="col-md-4">

            <div class="card-dashboard prediccion">

                <h5>
                    Predicción próximo mes
                </h5>

                <h2>
                    {{ prediccion }}
                </h2>

                <small>
                    compras estimadas
                </small>

            </div>

        </div>

    </div>

    <!-- GRAFICAS -->
    <div class="row">

        <div class="col-lg-6 mb-4">

            <div class="grafica-card">

                <h5 class="mb-3">
                    Usuarios por mes
                </h5>

                <Bar
                    v-if="usuariosChart"
                    :data="usuariosChart"
                />

            </div>

        </div>

        <div class="col-lg-6 mb-4">

            <div class="grafica-card">

                <h5 class="mb-3">
                    Ventas mensuales
                </h5>

                <Line
                    v-if="ventasChart"
                    :data="ventasChart"
                />

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>

.card-dashboard{

    background:white;

    padding:30px;

    border-radius:25px;

    box-shadow:
        0 10px 25px #192718;

    margin-bottom:20px;

}

.card-dashboard h5{

    color:#192718;

    margin-bottom:10px;

}

.card-dashboard h2{

    color:#192718;

    font-weight:bold;

}

.prediccion{

    background:#cae2e6;

}

.grafica-card{

    background:white;

    padding:25px;

    border-radius:25px;

    box-shadow:
        0 10px 25px #192718;

}

</style>