// Importar dependencias
const path = require('path')

require('dotenv').config({
      override:true,
      path: path.join(__dirname, '../db.env')
}); // Asegúrate de que esto esté presente

const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Importar rutas de productos
const inventoryRoutes = require('./routes/inventoryRoutes');


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

app.use('/api', inventoryRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprimir el error en la consola
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Obtener el puerto desde las variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3002;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});