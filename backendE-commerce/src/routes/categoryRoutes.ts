import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getProductsByCategory, getProductsByCategoryP } from '../controllers/categoryController';

const router = Router();

router.post('/', createCategory); // Crear una nueva categoría
router.get('/', getCategories); // Obtener todas las categorías
router.get('/byCategory/:categoryName', getProductsByCategory);
router.get('/category/:categoryId', getProductsByCategoryP); // Obtener productos por categoría con paginacion
router.delete('/:id', deleteCategory);

export default router;
