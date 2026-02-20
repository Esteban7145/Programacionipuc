const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protectAdmin,
  [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('inventory').isInt({ min: 0 }),
    body('category').notEmpty()
  ],
  createProduct
);

router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
