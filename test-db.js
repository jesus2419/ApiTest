const { Pool } = require('pg');
const path = require('path')

require('dotenv').config({
      override:true,
      path: path.join(__dirname, 'db.env')
}); // Asegúrate de que esto esté presente

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Probar la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa. Hora actual:', res.rows[0].now);
  }
  pool.end(); // Cierra la conexión
});