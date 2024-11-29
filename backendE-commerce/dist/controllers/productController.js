"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsBySearch = exports.getProductsByCategory = exports.getProducts = exports.updateProduct = exports.createProductsBulk = exports.createProduct = void 0;
const Producto_1 = __importDefault(require("../models/Producto"));
const sequelize_1 = require("sequelize"); // Importar directamente desde 'sequelize'
const sequelize_2 = __importDefault(require("sequelize"));
const ProductOption_1 = __importDefault(require("../models/ProductOption"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cost, price, stock, barcode, categoryId, productId } = req.body;
    const image = req.file ? req.file.filename : '';
    try {
        const newProduct = yield Producto_1.default.create({
            name,
            cost,
            price,
            stock,
            barcode,
            image,
            categoryId,
            productId
        }, {});
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ msg: 'Error creating product', error });
    }
});
exports.createProduct = createProduct;
// Crear múltiples productos (importación masiva)
const createProductsBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = req.body; // Se espera un array de productos
    try {
        const newProducts = yield Producto_1.default.bulkCreate(products);
        res.status(201).json(newProducts);
    }
    catch (error) {
        console.error('Error creating products:', error);
        res.status(500).json({ msg: 'Error creating products', error });
    }
});
exports.createProductsBulk = createProductsBulk;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del producto a actualizar
    const { name, cost, price, stock, barcode, categoryId } = req.body;
    let options = req.body.options;
    // Verifica si las opciones están en formato string, si es así, conviértelas a un array
    if (typeof options === 'string') {
        try {
            options = JSON.parse(options);
        }
        catch (error) {
            console.error('Error parsing options:', error);
            return res.status(400).json({ msg: 'Error al procesar las opciones' });
        }
    }
    const image = req.file ? req.file.filename : undefined;
    try {
        const product = yield Producto_1.default.findByPk(id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        // Actualizar el producto principal
        const updatedProduct = yield product.update({
            name,
            cost,
            price,
            stock,
            barcode,
            image,
            categoryId,
        });
        if (Array.isArray(options)) {
            console.log('Opciones recibidas:', options); // Comprobamos que ahora sí recibimos un array
            const existingOptions = yield ProductOption_1.default.findAll({ where: { productId: id } });
            // Actualizar o crear nuevas opciones
            for (const option of options) {
                const existingOption = existingOptions.find(opt => opt.description === option.description);
                if (existingOption) {
                    yield existingOption.update({
                        description: option.description,
                        price: option.price,
                    });
                }
                else {
                    yield ProductOption_1.default.create({
                        description: option.description,
                        price: option.price,
                        productId: Number(id),
                    });
                }
            }
            // Eliminar opciones que ya no existen
            const optionDescriptions = options.map(opt => opt.description);
            const optionsToDelete = existingOptions.filter(opt => !optionDescriptions.includes(opt.description));
            for (const option of optionsToDelete) {
                yield option.destroy();
            }
        }
        res.json(updatedProduct);
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ msg: 'Error al actualizar el producto', error });
    }
});
exports.updateProduct = updateProduct;
// Obtener todos los productos
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Producto_1.default.findAll({
            include: [{
                    model: ProductOption_1.default,
                    as: 'options'
                }]
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error fetching products', error });
    }
});
exports.getProducts = getProducts;
// Obtener productos por categoría con paginación
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        // Paginación: page (página actual) y limit (productos por página)
        const page = parseInt(req.query.page) || 1; // Página por defecto: 1
        const limit = parseInt(req.query.limit) || 6; // Productos por página por defecto: 10
        // Calcula el desplazamiento (offset) para la consulta
        const offset = (page - 1) * limit;
        // Realiza la consulta paginada
        const { count, rows: products } = yield Producto_1.default.findAndCountAll({
            where: { categoryId },
            include: [{
                    model: ProductOption_1.default,
                    as: 'options'
                }],
            limit,
            offset
        });
        // Devuelve los productos junto con información de la paginación
        res.json({
            products,
            totalItems: count, // Total de productos en la categoría
            totalPages: Math.ceil(count / limit), // Número total de páginas
            currentPage: page
        });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error fetching products by category', error });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query; // asumiendo que el parámetro de búsqueda se pasa como ?query=valor
    // Asegúrate de que 'query' es una cadena y no está vacía
    if (typeof query !== 'string' || !query) {
        return res.status(400).json({ msg: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
    }
    try {
        const products = yield Producto_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    // Buscar por nombre (insensible a mayúsculas/minúsculas)
                    sequelize_2.default.where(sequelize_2.default.fn('LOWER', sequelize_2.default.col('name')), {
                        [sequelize_1.Op.like]: `%${query.toLowerCase()}%`,
                    }),
                    // Buscar por código de barras
                    {
                        barcode: {
                            [sequelize_1.Op.like]: `%${query}%`,
                        },
                    },
                ],
            },
            include: [
                {
                    model: ProductOption_1.default,
                    as: 'options',
                },
            ],
        });
        res.json(products);
    }
    catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ msg: 'Error al buscar productos', error });
    }
});
exports.getProductsBySearch = getProductsBySearch;
