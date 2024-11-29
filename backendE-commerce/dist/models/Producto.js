"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Product = connection_1.default.define('Product', {
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'Categories',
            key: 'id',
        },
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'ProductOptions', // Asegúrate de que esto coincide con el nombre de la tabla en la base de datos
            key: 'id'
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    cost: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    price: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    stock: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    image: {
        type: sequelize_1.DataTypes.STRING
    },
    barcode: {
        type: sequelize_1.DataTypes.STRING
    }
});
exports.default = Product;
