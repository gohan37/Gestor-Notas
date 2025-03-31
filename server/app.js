const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const cors = require('cors');  // Agregar CORS

const firebaseConfig = {
  "type": "service_account",
  "project_id": "notas-73fbd",
  "private_key_id": "cd9b569857f56419cdf0185403b827693744ebc6",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzv1G0yrSRwxiV
ELrNeLrLAApStZegoPazzbHiwmNJfV1UQx2gwHXGyh17JpZxlwfCgyGpa2UsmIOO
liEz3JxGBfUN0o9VuwJTTFccBcErHVz2QMDqZ5VNA/4PSCPxduiRAbdwyRUALTK5
bPKiowoYvEf5pi4AJuN/+ariR7aMfqwxoPYnN22mChLW6eOqcThh55qLTtndr7KW
nnueunuTK6VHb2Rd+n0LeyqR9sadtLHedGMY9YPJM3lsK9GcB/qE6I+H9gqZAyxu
82cD+F833q1jG0r2iKOKHdh11rKWOhoeaS8wKWkemDNmGMt079xwzoPTmiO0k064
8L/PuprTAgMBAAECggEAHCsU7y5+YlgJnSqpq5OKP6Uk+QCI34ekwa6wJtIXDyg8
nPzbmBqGb9MIEF7kCq8EF0vHgFkFL5pDBkWpXwrpLowLyCZsMfTZkMY7jHeruvRM
t4aUSj0AsmNiyBr3ua/MaGpgHfuqdS71bluQIUPy9sdixtEaZQmzHetkB+FRzphe
E+hyPhNeDZTG0r4Q61uUjyM7QpD4va5iwI9Yi7U8iKjI3Ux5zIo/exKtfN5Wjq9T
Cx+c1B/sWMXBcIN4e836iPDzdny1ICuARpp1Eglkd8SqrPojCuV62WbgBm/hZJKt
sFxdAm0zyTx9qxbmw96II9EeY9AFm1AUyjqDpA/oyQKBgQD3IpUaxNixjbeGWhha
odA8Hab0H/7KTafpLQ1or8FqdADX3sqt6sAIGba5O9IVFhhISA7+X/xB6iYaqu7r
W4gqgh88uJRXQt7F3g9em71/VtRlz/ymvV9o+fvQZepMhGpc6IdXT5X27iKOlitn
mg0YNHmsRU+B6K0wLlaT8nJVbwKBgQC6MevsPOpvMvbm3X5D8caVnpCz96qLHRe8
rSwcr8P+ONVNB1TdCzGVJBj+sh3tiOS64q2/OknZNKNHc1IpWKhmhn4R0zDr30Dy
VSp/uYTvJ6CwihFfOhH+4EkliKSoOpsDhJTDKRj2PtfllLJkuY94rP/hVB7GxS9X
bGrZHr3G3QKBgQCHZSHtXYUemXa/m6KWHOrZ1KEARHsx2KOygyVCgm/j45QGsJ+3
8tGsXnIWP6jUNputFhVo1at9bUvc9mMY/Le4GjwE51cWC6PDIeqnuYlzN138PZu8
uimIeNS2Eu/vZehj6F0lv4t4knTKS4mSI/silLVIZVyu3ovrxqdWPNDY7wKBgQCk
jrRkwF2tU4yU85LBd/A7kb1v4OaQNnEhJqfC3rDIgPA7OMyO43K5zgJtL3x1z7Pf
W7GVPW3BEt1vq4Mk2Z9TpW/MTyuAe3qJ8i0yXwMW3p4NCKlb0RXQfecHziFAMTOJ
Q2a6qRrPnzDuTaHwlXMwgy1OtyrQH7u8dyxjoeC13QKBgEVKENlbM0CVNTQzeP74
nACwRDKRaDPwks19xQh3MVGY/2K6SRPHMPETDfOQt21PDda4ymvLwuquNbJto03D
Zz2rK9Q1D8E9FyXZZuSXopwoZUa7vZIy0nZHy15KV6zpAb6QPRUNnFLklzCV6+0g
epqASIBxeaZ8jMopTcbXqLpG
-----END PRIVATE KEY-----`,
  "client_email": "firebase-adminsdk-fbsvc@notas-73fbd.iam.gserviceaccount.com",
  "client_id": "112676778118856505471",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40notas-73fbd.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};


admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 4000;

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

