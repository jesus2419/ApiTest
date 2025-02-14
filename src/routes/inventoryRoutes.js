const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Rutas para inventario
router.get('/stores/:id/inventory', inventoryController.getInventoryByStore);

router.post('/inventory/transfer', inventoryController.transferProducts);


module.exports = router;