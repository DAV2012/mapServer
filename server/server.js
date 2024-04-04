const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Importa el módulo fs para trabajar con archivos
const app = express();
const puerto = 3001;
const { createReadStream } = require('fs');
const { stringify } = require('JSONStream');

app.use(express.json({ limit: '50000mb' }));
app.use(cors());

let datosTemporales = null; // Variable para almacenar datos temporales
let totalFeature = null;
let propertiesFeature = null;

// Ruta para guardar las propiedades
app.post('/guardar-properties', (req, res) => {
    const data = req.body;
    // Procesar los datos y guardarlos si es necesario
    propertiesFeature = data;
    // Enviar una respuesta de éxito si el procesamiento fue exitoso
    res.status(200).json({ success: true, message: 'Propiedades guardadas correctamente' });
});
  
// Ruta para guardar los datos
app.post('/guardar-datos', (req, res) => {
    const data = req.body;
    // Procesar los datos y guardarlos si es necesario
    totalFeature = data;
    // Enviar una respuesta de éxito si el procesamiento fue exitoso
    res.status(200).json({ success: true, message: 'Datos guardados correctamente' });
});

// Ruta para descargar los datos
// Ruta para descargar los datos
app.get('/descargar-datos', (req, res) => {
    if (!propertiesFeature || !totalFeature) {
        return res.status(404).send('No hay datos disponibles para descargar');
    }

    

    const datosTemporales = { ...propertiesFeature, features: totalFeature };

    // Establece los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename=datos.json');
    res.setHeader('Content-type', 'application/json');

    // Envía los datos directamente en la respuesta y finaliza la respuesta
    res.send(JSON.stringify(datosTemporales, null, 2));

    totalFeature = null;
});




// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor Express.js corriendo en el puerto ${puerto}`);
});
