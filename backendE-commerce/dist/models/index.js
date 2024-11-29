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
exports.syncDatabase = exports.ProductOption = exports.Product = exports.Category = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const Categoria_1 = __importDefault(require("./Categoria"));
exports.Category = Categoria_1.default;
const Producto_1 = __importDefault(require("./Producto"));
exports.Product = Producto_1.default;
const ProductOption_1 = __importDefault(require("./ProductOption"));
exports.ProductOption = ProductOption_1.default;
Categoria_1.default.hasMany(Producto_1.default, { as: 'product', foreignKey: 'categoryId' });
Producto_1.default.belongsTo(Categoria_1.default, { foreignKey: 'categoryId' });
// Un Producto tiene muchas Opciones de Producto
Producto_1.default.hasMany(ProductOption_1.default, { foreignKey: 'productId', as: 'options' });
ProductOption_1.default.belongsTo(Producto_1.default, { foreignKey: 'productId' });
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
        console.log('All models were synchronized successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.syncDatabase = syncDatabase;
