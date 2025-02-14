// Importar dependencias
require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Importar rutas de productos

// Crear una instancia de Express
const app = express();

// Configurar middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear el cuerpo de las solicitudes como JSON

// Configurar rutas
app.use('/api/products', productRoutes); // Usar las rutas de productos

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Gestión de Inventario!');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprimir el error en la consola
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Obtener el puerto desde las variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});