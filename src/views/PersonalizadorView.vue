<script setup>

import { onMounted, ref } from 'vue'
import { fabric } from 'fabric'


const canvas = ref(null)
const fontSize = ref(28)
const currentFont = ref('Arial')

onMounted(() => {

    canvas.value = new fabric.Canvas('canvas-personalizador', {

        width: 500,
        height: 500,
        backgroundColor: '#ffffff'

    })

})


// AGREGAR TEXTO
const agregarTexto = () => {

    const texto = new fabric.IText('Texto GARASUATO', {

        left: 100,
        top: 100,
        fill: '#000',
        fontSize: 28,
        editable: true

    })

    canvas.value.add(texto)

    canvas.value.setActiveObject(texto)

    texto.enterEditing()

    texto.selectAll()

    canvas.value.renderAll()

}


// CAMBIAR COLOR
const cambiarColor = (event) => {

    const objeto = canvas.value.getActiveObject()

    if(objeto){

        objeto.set('fill', event.target.value)

        canvas.value.renderAll()

    }

}

//cambiarTamano
const cambiarTamano = () => {

    const objeto = canvas.value.getActiveObject()

    if(objeto){

        objeto.set('fontSize', fontSize.value)

        canvas.value.renderAll()

    }

}

//cambiarFuente
const cambiarFuente = () => {

    const objeto = canvas.value.getActiveObject()

    if(objeto){

        objeto.set('fontFamily', currentFont.value)

        canvas.value.renderAll()

    }

}

//eliminarObjeto
const eliminarObjeto = () => {

    const objeto = canvas.value.getActiveObject()

    if(objeto){

        canvas.value.remove(objeto)

    }

}

//dibujo libre
const activarDibujo = () => {

    canvas.value.isDrawingMode = !canvas.value.isDrawingMode

}

//guardar Diseño
const guardarDiseno = async () => {

    try {

        // GENERAR IMAGEN
        const imagen = canvas.value.toDataURL({

            format: 'png',
            quality: 1

        })

        // GENERAR JSON
        const json = JSON.stringify(

            canvas.value.toJSON()

        )

        // ENVIAR API
        const response = await api.post(

            '/personalizados',

            {

                ID_prod: 1,
                json_diseno: json,
                imagen_preview: imagen

            }

        )

        console.log(response.data)

        alert('Diseño guardado')

    } catch (error) {

        console.log(error)

        alert('Error al guardar')

    }

}

// SUBIR IMAGEN
const subirImagen = (event) => {

    const archivo = event.target.files[0]

    if(!archivo) return

    const reader = new FileReader()

    reader.onload = (e) => {

        fabric.Image.fromURL(e.target.result, (img) => {

            img.scaleToWidth(200)

            canvas.value.add(img)

        })

    }

    reader.readAsDataURL(archivo)

}

</script>

<template>


    <div class="mb-3 d-flex gap-2 flex-wrap">

        <button
            class="btn btn-dark"
            @click="agregarTexto">

            Texto

        </button>

        <input
            type="color"
            @input="cambiarColor">

        <input
            type="file"
            accept="image/*"
            @change="subirImagen">

        <input
            type="number"
            v-model="fontSize"
            @input="cambiarTamano"
            min="10"
            max="100"
            class="form-control"
            style="width:100px">

        <select
            v-model="currentFont"
            @change="cambiarFuente"
            class="form-select"
            style="width:180px">

            <option>Arial</option>
            <option>Courier New</option>
            <option>Georgia</option>
            <option>Times New Roman</option>
            <option>Verdana</option>

        </select>   

        <button
            class="btn btn-danger"
            @click="eliminarObjeto">

            Eliminar

        </button>

        <button
            class="btn btn-primary"
            @click="activarDibujo">

            Dibujar

        </button>

                <button
            class="btn btn-success"
            @click="guardarDiseno">

            Guardar Diseño

        </button>

    </div>

    <canvas id="canvas-personalizador"></canvas>



</template>

<style scoped>

canvas{

    border:2px solid #ccc;
    border-radius:10px;

}

</style>