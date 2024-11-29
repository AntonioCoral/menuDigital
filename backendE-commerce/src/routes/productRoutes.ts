import { Router } from 'express';
import { createProduct, createProductsBulk, getProducts, getProductsByCategory, getProductsBySearch, updateProduct } from '../controllers/productController';
import upload from '../middlewares/upload';

const router = Router();

router.post('/', upload.single('image'), createProduct); // Crear un nuevo producto con imagen
router.get('/', getProducts); // Obtener todos los productos
router.post('/bulk', createProductsBulk); // Crear múltiples productos
router.get('/category/:categoryId', getProductsByCategory); // Obtener productos por categoría
router.put('/:id', upload.single('image'), updateProduct); // Actualizar un producto específico
router.get('/search', getProductsBySearch);

export default router;
