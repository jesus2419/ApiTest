const pool = require('../utils/db');

// Función para obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    if (minPrice) {
      conditions.push(`price >= $${params.length + 1}`);
      params.push(minPrice);
    }
    if (maxPrice) {
      conditions.push(`price <= $${params.length + 1}`);
      params.push(maxPrice);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para crear un producto
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, sku } = req.body;
    if (!name || !price || !sku) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, category, price, sku) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, category, price, sku]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, sku } = req.body;
    const { rows } = await pool.query(
      'UPDATE products SET name = $1, description = $2, category = $3, price = $4, sku = $5 WHERE id = $6 RETURNING *',
      [name, description, category, price, sku, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Exporta las funciones
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};