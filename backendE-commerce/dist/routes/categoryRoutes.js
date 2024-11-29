"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
router.post('/', categoryController_1.createCategory); // Crear una nueva categoría
router.get('/', categoryController_1.getCategories); // Obtener todas las categorías
router.get('/byCategory/:categoryName', categoryController_1.getProductsByCategory);
router.get('/category/:categoryId', categoryController_1.getProductsByCategoryP); // Obtener productos por categoría con paginacion
router.delete('/:id', categoryController_1.deleteCategory);
exports.default = router;
