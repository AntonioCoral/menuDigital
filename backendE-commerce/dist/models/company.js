"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Company extends sequelize_1.Model {
}
Company.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    contactEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    subdomain: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true, // Garantiza que no haya subdominios duplicados
        validate: {
            is: /^[a-z0-9-]+$/, // Validar formato de subdominio (letras, números y guiones)
        },
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Company',
    tableName: 'companies',
});
exports.default = Company;
