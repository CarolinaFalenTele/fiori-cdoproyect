const express = require('express');
const proxyMiddleware = require('./proxy'); // Ajusta la ruta según la ubicación correcta

const app = express();

// Usa el middleware de proxy
proxyMiddleware(app);

// Resto de la configuración de tu aplicación Express
// Por ejemplo, definición de rutas, manejo de errores, etc.

// Escucha en un puerto específico
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
