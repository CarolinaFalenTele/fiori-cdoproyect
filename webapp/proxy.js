const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Asegúrate de que esto coincide con tu ruta de la API
    proxy({
      target: 'https://your-sap-build-process-automation-url',  // Reemplaza con tu URL de destino
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Elimina el prefijo /api de las solicitudes
      },
    })
  );
};
