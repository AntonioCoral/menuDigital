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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCarouselImage = exports.addImageWithSection = exports.deleteImage = exports.updateImage = exports.addImage = exports.getImagesBySection = void 0;
const carouselImage_model_1 = require("./../models/carouselImage.model");
// Obtener imágenes por sección (carousel o home)
const getImagesBySection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { section } = req.params;
    if (!['carousel', 'home'].includes(section)) {
        return res.status(400).json({ message: 'Sección inválida' });
    }
    try {
        const images = yield carouselImage_model_1.CarouselImage.findAll({ where: { section } });
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener imágenes', error });
    }
});
exports.getImagesBySection = getImagesBySection;
// Agregar una nueva imagen al carrusel
const addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageUrl } = req.body;
        const newImage = yield carouselImage_model_1.CarouselImage.create({ title, description, imageUrl });
        res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar la imagen', error });
    }
});
exports.addImage = addImage;
// Actualizar una imagen del carrusel
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, isActive } = req.body;
        const [updatedRows] = yield carouselImage_model_1.CarouselImage.update({ title, description, imageUrl, isActive }, { where: { id: +id } });
        if (!updatedRows) {
            res.status(404).json({ message: 'Imagen no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Imagen actualizada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la imagen', error });
    }
});
exports.updateImage = updateImage;
// Eliminar una imagen del carrusel
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedRows = yield carouselImage_model_1.CarouselImage.destroy({ where: { id: +id } });
        if (!deletedRows) {
            res.status(404).json({ message: 'Imagen no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Imagen eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la imagen', error });
    }
});
exports.deleteImage = deleteImage;
const addImageWithSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, section } = req.body;
        const imageUrl = req.file ? req.file.filename : '';
        const newImage = yield carouselImage_model_1.CarouselImage.create({
            title,
            description,
            imageUrl,
            section,
        });
        res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar la imagen', error });
    }
});
exports.addImageWithSection = addImageWithSection;
const uploadCarouselImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
        return;
    }
    try {
        // Ruta relativa de la imagen (URL para acceder desde el cliente)
        const imageUrl = req.file ? req.file.filename : '';
        // Opcional: Guarda la URL en la base de datos
        const newImage = yield carouselImage_model_1.CarouselImage.create({
            title: req.body.title || 'Sin título', // Campo opcional para un título
            description: req.body.description || 'Sin descripción', // Campo opcional para una descripción
            imageUrl: imageUrl,
        });
        res.status(200).json({
            message: 'Imagen subida con éxito.',
            data: newImage, // Retorna la imagen subida con los detalles
        });
    }
    catch (error) {
        console.error('Error al guardar la imagen en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
exports.uploadCarouselImage = uploadCarouselImage;
