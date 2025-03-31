const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const cors = require('cors');  // Agregar CORS

const serviceAccount = JSON.parse(fs.readFileSync('./server/firebaseConfig.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());  // Usar CORS para habilitar peticiones desde otros dominios

console.log("Iniciando servidor...");

// Middleware para servir archivos estáticos (frontend)
app.use(express.static('public'));

// Ruta principal
app.get('/test', (req,res) => {
    res.send('¡Hola desde el servidor Express!');
});

// Ruta para crear una nueva nota
app.post('/guardar-nota', async (req,res) => {
  try {
    const { titulo, contenido } = req.body;

    // Validación simple
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const nuevaNota = {
      titulo,
      contenido,
      fecha: new Date().toISOString()
    };

    // Agregar la nota a la colección 'notas'
    const docRef = await db.collection('notas').add(nuevaNota);

    res.json({ id: docRef.id, ...nuevaNota });  // Devolvemos la nota con el ID asignado
  } catch (error) {
    res.json({ error: 'Error al guardar la nota: ' + error.message });
  }
});

// Ruta para obtener las notas guardadas
app.get('/notas', async (_req,res) => {
    try {
        const snapshot = await db.collection('notas').get();
        const notas = snapshot.docs.map(doc => doc.data());
        res.json(notas);  // Devuelve las notas al frontend
    } catch (error) {
        res.status(500).send('Error al obtener las notas: ' + error.message);
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

