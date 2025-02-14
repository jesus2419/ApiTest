const pool = require('../utils/db');

// Transferir productos entre tiendas
const transferProducts = async (req, res) => {
  try {
    const { productId, sourceStoreId, targetStoreId, quantity } = req.body;

    // Verificar stock en la tienda de origen
    const { rows: sourceStock } = await pool.query(
      'SELECT quantity FROM inventory WHERE product_id = $1 AND store_id = $2',
      [productId, sourceStoreId]
    );
    if (sourceStock.length === 0 || sourceStock[0].quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente en la tienda de origen' });
    }

    // Iniciar transacción
    await pool.query('BEGIN');

    // Reducir stock en la tienda de origen
    await pool.query(
      'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND store_id = $3',
      [quantity, productId, sourceStoreId]
    );

    // Aumentar stock en la tienda de destino
    await pool.query(
      'INSERT INTO inventory (product_id, store_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (product_id, store_id) DO UPDATE SET quantity = inventory.quantity + $3',
      [productId, targetStoreId, quantity]
    );

    // Registrar movimiento
    await pool.query(
      'INSERT INTO movements (product_id, source_store_id, target_store_id, quantity, type) VALUES ($1, $2, $3, $4, $5)',
      [productId, sourceStoreId, targetStoreId, quantity, 'TRANSFER']
    );

    // Confirmar transacción
    await pool.query('COMMIT');

    res.status(201).json({ message: 'Transferencia realizada con éxito' });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

// Listar inventario por tienda
const getInventoryByStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT p.*, i.quantity FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.store_id = $1',
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLowStockAlerts = async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT p.*, i.quantity FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.quantity < i.min_stock'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Exportar todas las funciones en un solo objeto
module.exports = {
  transferProducts,
  getLowStockAlerts,
  getInventoryByStore,
};