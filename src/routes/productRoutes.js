const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Importa el controlador

// Rutas para productos
router.get('/', productController.getAllProducts); // Asegúrate de que getAllProducts esté definido
router.get('/:id', productController.getProductById); // Asegúrate de que getProductById esté definido
router.post('/', productController.createProduct); // Asegúrate de que createProduct esté definido
router.put('/:id', productController.updateProduct); // Asegúrate de que updateProduct esté definido
router.delete('/:id', productController.deleteProduct); // Asegúrate de que deleteProduct esté definido

module.exports = router;