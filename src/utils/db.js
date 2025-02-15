const { Pool, Client } = require('pg');
const path = require('path')
require('dotenv').config({
      override:true,
      path: path.join(__dirname, '../../db.env')
}); // Asegúrate de que esto esté presente

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Asegúrate de que esto sea una cadena
  database: process.env.DB_NAME,
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);


module.exports = pool;