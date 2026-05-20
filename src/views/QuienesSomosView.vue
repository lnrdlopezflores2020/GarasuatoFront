<script setup>
</script>

<template>

<div class="container py-5">

    <div class="hero-garasuato text-center">

        <img
            src="/gara2.png"
            class="hongo-img"
        >

        <h1>
            ¿Quiénes somos?
        </h1>

        <p>
            Arte personalizado para transformar objetos cotidianos en piezas únicas.
        </p>

    </div>

    <div class="info-card">

        <h3>Historia de GARASUATO</h3>

        <p>
            GARASUATO nació de la pasión de su fundadora por el arte, quien comenzó compartiendo sus creaciones para ganar experiencia y perfeccionar sus habilidades. Con el tiempo, identificó la oportunidad de fusionar el arte con objetos de uso cotidiano, iniciando con fundas personalizadas para teléfonos que permitieran a cada cliente expresar su estilo personal mediante piezas únicas y artesanales.
        </p>

        <p>
            Posteriormente, la marca amplió su catálogo con vitrales decorativos y sudaderas personalizadas, manteniendo siempre el enfoque en productos funcionales, creativos y hechos con dedicación artística. Actualmente, GARASUATO busca fortalecer su presencia digital mediante un sistema que facilite la personalización y gestión de pedidos, mientras continúa promoviendo el valor del arte en la vida cotidiana.
        </p>

    </div>

    <div class="grid-info">

        <div class="info-card">
            <h3>Misión</h3>
            <p>
                Generar una conexión emocional con el cliente mediante la transformación de objetos cotidianos en piezas artesanales personalizadas llenas de arte y significado.
            </p>
        </div>

        <div class="info-card">
            <h3>Visión</h3>
            <p>
                Posicionar a GARASUATO en los próximos 5 años como una marca reconocida a nivel nacional por la creación de productos artesanales personalizados, destacando por su calidad artística, originalidad e integración del arte en la vida cotidiana.
            </p>
        </div>

    </div>

    <div class="info-card">

        <h3>Objetivo general</h3>

        <p>
            Impulsar el crecimiento sostenible de GARASUATO fortaleciendo su propuesta de valor basada en la personalización artesanal y la atención al cliente, incrementando sus ventas y consolidando su posicionamiento en el mercado.
        </p>

    </div>

    <div class="grid-info">

        <div class="info-card">
            <h3>Objetivos específicos</h3>

            <ul>
                <li>Diseñar y comercializar productos personalizados garantizando atención personalizada.</li>
                <li>Implementar un sistema web para optimizar pedidos, clientes y ventas.</li>
                <li>Fortalecer la presencia digital mediante contenido constante en redes sociales.</li>
                <li>Ampliar el catálogo de productos personalizados.</li>
                <li>Incrementar ingresos mediante fidelización y diversificación de productos.</li>
            </ul>
        </div>

        <div class="info-card">
            <h3>Valores</h3>

            <div class="valores">
                <span>Pasión por el arte</span>
                <span>Autenticidad</span>
                <span>Calidad artesanal</span>
                <span>Empatía con el cliente</span>
                <span>Revalorización del arte</span>
                <span>Creatividad constante</span>
                <span>Compromiso personal</span>
            </div>
        </div>

    </div>

</div>

</template>

<style scoped>

.hero-garasuato{
    background:#f7f7f7;
    padding:45px;
    border-radius:30px;
    box-shadow:0 8px 25px rgba(0,0,0,.08);
    margin-bottom:35px;
}

.hongo-img{
    width:120px;
    margin-bottom:20px;
}

.hero-garasuato h1{
    color:#192718;
    font-weight:800;
}

.hero-garasuato p{
    color:#666;
}

.info-card{
    background:white;
    padding:30px;
    border-radius:25px;
    box-shadow:0 8px 25px rgba(0,0,0,.08);
    margin-bottom:25px;
}

.info-card h3{
    color:#192718;
    font-weight:700;
    margin-bottom:15px;
}

.info-card p,
.info-card li{
    color:#555;
    line-height:1.7;
}

.grid-info{
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
    gap:25px;
}

.valores{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
}

.valores span{
    background:#cae2e6;
    color:#192718;
    padding:10px 14px;
    border-radius:15px;
    font-weight:600;
    font-size:14px;
}

.hongo-img{

    width:120px;
    height:120px;

    object-fit:cover;

    border-radius:50%;

    border:4px solid #cae2e6;

    box-shadow:
        0 8px 20px rgba(0,0,0,.12);

}

</style>