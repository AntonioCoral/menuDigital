"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselImage = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class CarouselImage extends sequelize_1.Model {
}
exports.CarouselImage = CarouselImage;
CarouselImage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    section: {
        type: sequelize_1.DataTypes.ENUM('carousel', 'home'),
        allowNull: false,
        defaultValue: 'carousel',
    },
}, {
    sequelize: connection_1.default,
    modelName: 'CarouselImage',
    tableName: 'carousel_images', // Opcional: define el nombre de la tabla
    timestamps: true, // Crea columnas createdAt y updatedAt automáticamente
});
exports.default = CarouselImage;
