const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Asegúrate de que esto sea una cadena
  database: process.env.DB_NAME,
});
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Verifica que la contraseña sea correcta
module.exports = pool;